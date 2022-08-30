import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import IApi from './api';
import initApi from './api/api';
import App from './App';

import { ServiceProvider } from './contexts/services';

export const backendURL = 'http://localhost:8000';

const api: IApi = initApi(backendURL);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <ServiceProvider getApi={() => api}>
        <BrowserRouter basename="/">
            <App />
        </BrowserRouter>
    </ServiceProvider>
);