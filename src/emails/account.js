const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const welcomeMessage = (name, email) => {
	sgMail.send({
		to: email,
		from: 'mikejross6@gmail.com',
		subject: 'Welcome to our team',
		text: `dear ${name} Welcome to greenearth How you check am?`,
		// html: '<b>HTML Text</b>',
	});
};

const goodbyeMessage = (name, email) => {
	sgMail.send({
		to: email,
		from: 'mikejross6@gmail.com',
		subject: 'Go joor...',
		text: `${name} who you help, i nor wan see you for this site again!`,
	});
};
module.exports = {
	welcomeMessage,
	goodbyeMessage,
};
