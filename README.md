# Waterlock Local Auth using sms & code


waterlock-local-sms-auth is a module for [waterlock](http://waterlock.ninja/)
providing a local authentication method for users either based on phone number and sms code.
Its a adaptation of waterlock-local-auth code but for inputs for authenticaltion.
Also serves as a sample code for somebody who wants to modify waterlock-local-auth.

## Usage

```bash
npm install waterlock-local-sms-auth
```

set the following option in your `waterlock.js` config file

```js
authMethod:[
	{
		name: "waterlock-local-auth",
		passwordReset: {
			tokens: boolean, // object containing information regarding password resets

			// object containing information about your smtp server, see nodemailer
			mail: {
				options: string, // how it is use te transport method, see nodemailer
				from: string, // the from address
				subject: string, // the email subject for password reset emails
				forwardUrl: string // the url to send the user to after they have clicked the password reset link in their inbox (e.g. a form on your site which POST to `/auth/reset`)
			},

			// object containing template information for the reset emails
			template:{
				file: string, // the relative path to the `jade` template for the reset emails
				vars: object, // object containing any vars you want passed to the template for rendering
			}
		},
		createOnNotFound: boolean // should local auth try to create the user on a failed login attempt, good if you do not want to implement a registration form.
	}
]
```

## Auth Model
Local auth adds the following attributes onto the Auth model

```js
  phone: {
    type: 'string',
    unique: true
  },
  smsCode: {
    type: 'string',
    minLength: 4
  },
  resetToken: {
    model: 'resetToken'
  }
```

if you choose to go with this option then a user upon visiting the url `/auth/reset` with a post param of `email` will receieve an email at that address with the reset url. This url upon clicked with be validated against the server to ensure it's still within the time window allotted for a password reset. If so will set the `resetToken` session variable. After this if you have set a `forwardUrl` in your `waterlock.js` config file the user will be forwarded to this page.

Your user can simply try to login to `/login` if the user is not found one will be created using [waterlines](https://github.com/balderdashy/waterline) `findOrCreate` method

TODOs:
Improve documentation & remove username, email & passwordReset from places its not required.
Autogenerate a new sms code when a phone number is received.
Add twillio or some sms api to send sms.
Check the resetToken using the old token.
write test cases(fix) for the code.
