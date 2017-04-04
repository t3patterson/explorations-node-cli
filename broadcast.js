const fs = require('fs')
const {parse} = require('csv')
const program = require('commander')

program
	.version('0.0.1')
   .option('-l, --list [csv_list]', 'list of customers in CSV file')
	.parse(process.argv)
	
let stream = fs.createReadStream(program.list)
  .pipe(parse({ delimter: ',' }));

stream.on('data', (data)=>{
	let firstName = data[0];
	let lastName = data[1];
	let email = data[2];
	console.log(firstName, lastName, email)
})