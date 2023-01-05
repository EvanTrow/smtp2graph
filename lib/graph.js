const axios = require('axios');

module.exports = {
	getToken: async function () {
		const params = new URLSearchParams();
		params.append('grant_type', 'client_credentials');
		params.append('client_id', process.env.CLIENT_ID);
		params.append('client_secret', process.env.CLIENT_SECRET);
		params.append('resource', 'https://graph.microsoft.com');
		const res = await axios.post(`https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/token`, params);
		return res.data.access_token;
	},

	sendEmail: async function (token, email) {
		return axios
			.post(
				'https://graph.microsoft.com/v1.0/users/' + email.from + '/sendMail',
				{
					message: {
						from: {
							emailAddress: {
								name: email.fromName,
								address: email.from,
							},
						},
						subject: email.subject,
						body: {
							contentType: 'HTML',
							content: email.body,
						},
						toRecipients: email.to.map((address) => {
							return {
								emailAddress: {
									address: address,
								},
							};
						}),
					},
					saveToSentItems: 'true',
				},
				{
					headers: { Authorization: 'Bearer '.concat(token) },
					'Content-Type': 'application/json',
				}
			)
			.then((response) => {
				return response;
			})
			.catch((error) => {
				return error.response;
			});
	},
};
