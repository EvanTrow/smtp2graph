import React from 'react';
import { useEmail } from './lib/useEmail';
import { Email } from './lib/types';

import { Box, Container, Grid, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';

import EmailDialog from './EmailDialog';

export default function App() {
	const { emails } = useEmail();

	const [selectedEmail, setSelectedEmail] = React.useState<Email | null>(null);

	return (
		<Box
			sx={{
				bgcolor: 'background.paper',
				pt: 8,
				pb: 6,
			}}
		>
			<Container maxWidth='md'>
				<Typography variant='h3' align='center' color='text.primary' gutterBottom>
					M365 Email Relay
				</Typography>
				<Typography variant='h5' align='center' color='text.secondary' paragraph>
					Here you can view the relayed messages.
				</Typography>

				{/* {JSON.stringify(emails)} */}

				<List>
					{emails.map((email) => (
						<ListItem key={email.id} disablePadding>
							<ListItemButton onClick={() => setSelectedEmail(email)}>
								<Grid container spacing={1}>
									<Grid item xs>
										<ListItemText
											primary={
												<>
													{email.from}
													{email.fromName && ` - ${email.fromName}`}
													<br />
													{email.subject}
													{' — '}
													{email.date}
												</>
											}
											secondary={
												<React.Fragment>
													<Typography component='span' variant='body2' sx={{ display: 'inline' }} color='textPrimary'>
														{'> '}
														<span>{email.to}</span>
													</Typography>
													{' — '}
													{email.text.substring(0, 75)}
													{email.text.length > 75 && '...'}
												</React.Fragment>
											}
										/>
									</Grid>
								</Grid>
							</ListItemButton>
						</ListItem>
					))}
				</List>
				<EmailDialog email={selectedEmail} setEmail={(e) => setSelectedEmail(e)} />
			</Container>
		</Box>
	);
}
