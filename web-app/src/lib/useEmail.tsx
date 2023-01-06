import * as React from 'react';

import axios from 'axios';

import { Email } from './types';
import { Socket } from 'socket.io-client';

/**
 * useEmail returns the Email Repos
 * ```typescript
 * // get full client instance
 * const Email = useEmail();
 * // or specific members of the SupabaseClient class
 * const { emails } = useEmail();
 * ```
 */

export const useEmail = () => {
	const context = React.useContext(EmailContext);

	if (context === undefined) {
		throw new Error('useEmail must be used within a EmailContext.Provider');
	}

	return {
		emails: context.emails as Email[],
	};
};

export type EmailContextType = {
	emails: Email[];
};

export const EmailContext = React.createContext<EmailContextType>({
	emails: [],
});

/**
 * EmailContextProvider is a context provider giving access to the Email to child along the React tree
 * ```typescript
 * <EmailContextProvider>
 *    <Content />
 * </EmailContextProvider>
 * ```
 */

export const EmailContextProvider: React.FC<{ children: JSX.Element; socket: Socket }> = ({ children, socket }) => {
	const [emails, setEmails] = React.useState<Email[]>([]);

	React.useEffect(() => {
		const listenForNewEmails = () => {
			socket.emit('join', 'newEmails');

			socket.on('newEmails', (data) => {
				console.log('New email:', data);
				setEmails((emails) => [data as Email, ...emails]);
			});
		};

		const getEmails = async () => {
			await axios
				.get('/api/emails')
				.then((res) => {
					console.log(res.data);
					setEmails(res.data.reverse());
					listenForNewEmails();
				})
				.catch((err) => {
					console.log(err);
				});
		};

		getEmails();
	}, [socket]);

	return <EmailContext.Provider value={{ emails: emails }}>{children}</EmailContext.Provider>;
};
