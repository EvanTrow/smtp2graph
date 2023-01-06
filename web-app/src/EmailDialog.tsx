import * as React from 'react';

import { Email } from './lib/types';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export type AlertDialogDialogProps = {
	email: Email | null;
	setEmail(email: Email | null): void;
};

export default function AlertDialog(props: AlertDialogDialogProps) {
	const handleClose = () => {
		props.setEmail(null);
	};

	if (props.email) {
		return (
			<Dialog open={true} onClose={handleClose} maxWidth='md' fullWidth>
				<DialogTitle>{props.email.subject}</DialogTitle>
				<DialogContent>
					<span dangerouslySetInnerHTML={{ __html: props.email.body.replaceAll('<a ', '<a target="_blank" ') }} />
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Close</Button>
				</DialogActions>
			</Dialog>
		);
	} else {
		return <></>;
	}
}
