import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import IApi from './api';
import initApi from './api/api';
import { EventHandler, initSocketIOEventHandler } from './api/event_handler';
import App from './App';
import { ClientToServerEvents, ServerToClientEvents } from '../../shared/events';

import { ServiceProvider } from './contexts/services';

// initialize dependencies
const url = import.meta.env.VITE_API_URL ?? `${window.location.origin}/api`;
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(url);
const eventHandler: EventHandler = initSocketIOEventHandler(socket);
const api: IApi = initApi(eventHandler);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <ServiceProvider getApi={() => api}>
        <BrowserRouter basename="/">
            <App />
        </BrowserRouter>
    </ServiceProvider>
);