require('dotenv').config();
const SMTPServer = require('smtp-server').SMTPServer;
const parser = require('mailparser').simpleParser;
const moment = require('moment');
const graph = require('./lib/graph');
const { stringToBoolean } = require('./lib/utils');

const express = require('express');
const app = express();

var env = {};
for (const property in process.env) {
	env[property] = stringToBoolean(process.env[property]);
}

const config = {
	// Listening Ports
	PORT: 25,
	HTTP_PORT: 3000,

	// Microsoft Graph Creds
	CLIENT_ID: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
	CLIENT_SECRET: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
	TENANT_ID: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',

	// disable email relay
	DEV_MODE: false,

	// enable web server
	WEB_SERVER: false,
	WEB_SERVER_MESSAGE_LIMIT: 50,

	...env,
};

if (!config.CLIENT_ID || !config.CLIENT_SECRET || !config.TENANT_ID) {
	console.error('Invalid Config', {
		CLIENT_ID: config.CLIENT_ID,
		CLIENT_SECRET: config.CLIENT_SECRET,
		TENANT_ID: config.TENANT_ID,
	});
	process.exit();
}
var sentMessages = [];

const smtpServer = new SMTPServer({
	hideSTARTTLS: true,

	onData(stream, session, callback) {
		// callback();
		parser(stream, {}, async (err, msg) => {
			if (err) {
				console.log('Error:', err);
				return;
			}

			const email = {
				id: sentMessages.length,
				date: moment(msg.date).format('L LTS'),
				from: msg.from.value[0].address,
				fromName: msg.from.value[0].name,
				to: msg.to.value.map((to) => to.address),
				subject: msg.subject,
				body: msg.html || msg.text,
			};

			console.log('New Message:', email);

			if (!config.DEV_MODE) {
				const token = await graph.getToken();
				const res = await graph.sendEmail(token, email);

				if (res.status !== 202) {
					console.log('Graph Error:', res.data);
					callback(res.data);
				} else {
					console.log('Email relayed:', res.status);
					callback();
				}
			} else {
				console.log('Email relay skipped:', 'DEV_MODE =', config.DEV_MODE);
				sentMessages.push(email);

				if (sentMessages.length > parseInt(config.WEB_SERVER_MESSAGE_LIMIT || 50)) sentMessages.shift();

				callback();
			}
		});
	},

	disabledCommands: ['AUTH'],
});

smtpServer.listen(config.PORT);
smtpServer.on('error', (err) => {
	console.log('Error %s', err.message);
});
console.log(`SMTP server listening on port ${config.PORT}`);

//
// Web server for tracking messages
if (config.WEB_SERVER == true) {
	app.get('/', (req, res) => {
		res.send(`<!DOCTYPE html>
	<html>
		<head>
			<meta charset="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<title>M365 Email Relay</title>

			<script>
				document.documentElement.setAttribute('data-bs-theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
			</script>

			<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
		</head>
		<body>
			<div class="container">
				<main>
					<div class="py-5 text-center" >
						<h2 >M365 Email Relay</h2>
					</div>
					<div class="row g-6">
					<table class="table table-hover">
						<thead>
							<tr>
								<th scope="col">Date/Time</th>
								<th scope="col">From</th>
								<th scope="col">To</th>
								<th scope="col">Subject</th>
							</tr>
						</thead>
							<tbody>
								${sentMessages
									.map((msg) => {
										return `
								<tr style="cursor: pointer" onclick="modal${msg.id}.show()">
									<td>${msg.date}</td>
									<td>${msg.from}</td>
									<td>${msg.to}</td>
									<td>${msg.subject}</td>
								</tr>`;
									})
									.reverse()
									.join('')}
							</tbody>
						</table>
					</div>
				</main>
				<nav class="navbar fixed-bottom">
					<div class="container">
						<span class="text-muted">Check out my Github: <a href="https://github.com/EvanTrow" target="_blank">EvanTrow</a></span>
					</div>
				</nav>
			</div>

			<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"></script>
			<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js" integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3" crossorigin="anonymous"></script>
			<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.min.js" integrity="sha384-mQ93GR66B00ZXjt0YO5KlohRA5SY2XofN4zfuZxLkoj1gXtW8ANNCe9d5Y3eG5eD" crossorigin="anonymous"></script>

			${sentMessages
				.map((msg) => {
					return `
				<div class="modal" id="modal${msg.id}" tabindex="-1">
					<div class="modal-dialog modal-xl modal-dialog-centered">
						<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title">${msg.subject}</h5>
							<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div class="modal-body">
							${msg.body.replaceAll('<a ', `<a target='_blank'`)}
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
						</div>
						</div>
					</div>
				</div>

				<script>
					var modal${msg.id} = new bootstrap.Modal(document.getElementById('modal${msg.id}'));
				</script>`;
				})
				.reverse()
				.join('')}
		</body>
	</html>
	`);
	});

	app.listen(config.HTTP_PORT || 3000, () => {
		console.log(`Web server listening on port ${config.HTTP_PORT || 3000}`);
	});
}
