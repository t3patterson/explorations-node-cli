const fs = require('fs');
const {parse} = require('csv');
const program = require('commander');
const inquirer = require('inquirer');
const async = require('async')
const chalk = require('chalk')

const sendEmail = require('./services/sendgrid.js')
let contactList = []

program
	.version('0.0.1')
   .option('-l, --list [csv_list]', 'list of customers in CSV file')
	.parse(process.argv)
	
let stream = fs.createReadStream(program.list)
  .pipe(parse({ delimter: ',' }));

stream
	.on('data', (dataRowArray)=>{
		// console.log(dataRowArray)//csv row as an Array
		let firstName = dataRowArray[0];
		let lastName = dataRowArray[1];
		let email = dataRowArray[2];
		contactList = [...contactList, {name: `${firstName} ${lastName}`, email: email}]
	})
	.on("end", ()=>{
		let questions = [
			{ type: 'input', name: 'sender.email', message: "Sender's email address > " },
 			{ type: 'input', name: 'sender.name', message: "Sender's name > " },
			{ type: 'input', name: 'subject', message: "Subject > " },
		]
		inquirer.prompt(questions).then((answers)=>{
			console.log(answers);
			async.each(
				contactList, 
				function(recipient, verifyFn){
					let {sender, subject} = answers
						console.log('sending emails....');
					sendEmail(recipient, sender, subject, verifyFn)
				},
			 	function(err) {
					if(err){ return console.log(chalk.red(err.message)) }
					console.log(chalk.green('SUCCESS!'))
				}
			)	
		})
	})
	.on('error',(err)=>{return console.error(err.response)})