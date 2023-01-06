import React from 'react';
import ReactDOM from 'react-dom/client';
import Theme from './Theme';
import reportWebVitals from './reportWebVitals';

import socketIOClient from 'socket.io-client';
import { EmailContextProvider } from './lib/useEmail';

const socket = socketIOClient(window.location.hostname + ':8080'); // initialize socket

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<>
		<EmailContextProvider socket={socket}>
			<Theme />
		</EmailContextProvider>
	</>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
