import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import './utils/i18n';
/* import './assets/styles/base/base.css'; */


const GlitchDns = import.meta.env.VITE_GLITCH_DNS;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
