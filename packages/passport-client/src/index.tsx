import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

if (process.env.NODE_ENV === 'development') {
	window.addEventListener('error', (e) => {
		const msg = String((e as any)?.message ?? '');
		if (
			msg.includes('ResizeObserver loop completed with undelivered notifications') ||
			msg.includes('ResizeObserver loop limit exceeded')
		) {
			e.preventDefault();
			(e as any).stopImmediatePropagation?.();
			return false as any;
		}
		return;
	}, true);
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
	<App />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
