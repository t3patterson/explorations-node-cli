let apiKey = require('../secrets.js').sendgridApiKey
let sg = require('sendgrid')(apiKey)
let helper = require('sendgrid').mail

let sendEmail = function(to, from, subject, iteratorCb){
	let template = "Wish you a Merry Xmas and a prosperous year ahead"
	let fromEmail = new helper.Email(from.email, from.name)
	let toEmail = new helper.Email(to.email, to.name)
	let body = new helper.Content('text/plain', template)
	let mailInstance = new helper.Mail(fromEmail, subject, toEmail, body)
	
	let request = sg.emptyRequest({
		method: 'POST',
		path: '/v3/mail/send',
		body: mailInstance.toJSON()
	})
	
	console.log('requesting....')
	sg.API(request, (err, res)=>{
		if(err){ 
			iteratorCb(err)
			return
		}
		return iteratorCb()
	})
	
}


module.exports = sendEmail