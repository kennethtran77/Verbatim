import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { io } from 'socket.io-client';
import IApi from './api';
import initApi from './api/api';
import { EventHandler, initSocketIOEventHandler } from './api/event_handler';
import App from './App';

import { ServiceProvider } from './contexts/services';

// initialize dependencies
const devUrl = `http://localhost:8000/api`;
const prodUrl = `${window.location.origin}/api`;
const eventHandler: EventHandler = initSocketIOEventHandler(io(prodUrl));
const api: IApi = initApi(eventHandler);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <ServiceProvider getApi={() => api}>
        <BrowserRouter basename="/">
            <App />
        </BrowserRouter>
    </ServiceProvider>
);