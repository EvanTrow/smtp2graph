import { Email, EmailRequest } from './types';

require('dotenv').config();
import { getToken, sendEmail } from './lib/graph';
import { stringToBoolean } from './lib/utils';

import smtp from 'smtp-server';
import { simpleParser as parser } from 'mailparser';
import fs from 'fs';
import path from 'path';
import http from 'http';
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';

import moment from 'moment';

const app = express();
app.use(
	cors({
		origin: '*',
		optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
	})
);

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	},
});

var env: any = {};
for (const property in process.env) {
	env[property] = stringToBoolean(process.env[property]);
}

const config = {
	// Listening Ports
	PORT: 465,
	HTTP_PORT: 8080,

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

let sentMessages: Email[] = [];
const smtpServer = new smtp.SMTPServer({
	secure: true,
	authOptional: true,

	key: fs.readFileSync('key.pem'),
	cert: fs.readFileSync('cert.pem'),
	logger: true,

	onData(stream, session, callback) {
		parser(stream, {}, async (err, msgTemp: unknown) => {
			if (err) {
				console.log('Error:', err);
				return;
			}
			let msg = msgTemp as EmailRequest;

			const email = {
				id: sentMessages.length,
				date: moment(msg.date).format('L LTS'),
				from: msg.from?.value[0].address,
				fromName: msg.from?.value[0].name,
				to: msg.to.value.map((a) => a.address),
				cc: msg.cc ? msg.cc.value.map((a) => a.address) : undefined,
				bcc: msg.bcc ? msg.bcc.value.map((a) => a.address) : undefined,
				subject: msg.subject,
				body: msg.html || '',
				text: msg.text || '',
				attachments: msg.attachments,
			};

			console.log('New Message:', email);

			if (config.WEB_SERVER == true) {
				sentMessages.push(email);
				if (sentMessages.length > parseInt(config.WEB_SERVER_MESSAGE_LIMIT || 50)) sentMessages.shift();

				// send new email to web clients
				io.emit('newEmails', email);
			}

			if (!config.DEV_MODE) {
				const token = await getToken();
				const res = await sendEmail(token, email);

				if (res.status !== 202) {
					console.log('Graph Error:', res.data);
					callback(res.data);
				} else {
					console.log('Email relayed:', res.status);
					callback();
				}
			} else {
				console.log('Email relay skipped:', 'DEV_MODE =', config.DEV_MODE);
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
	// serve web content
	app.use(express.static(path.join(__dirname, '/build')));

	app.get('/api/emails', (req, res) => {
		res.send(sentMessages);
	});

	io.on('connection', (socket) => {
		console.log('New client:', socket.id);

		socket.on('hello', (data) => {
			console.log(data);
		}); // listen to the event
	});

	server.listen(config.HTTP_PORT || 8080, () => {
		console.log(`Web server listening on port ${config.HTTP_PORT || 3000}`);
	});
}
