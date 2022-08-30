import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import IApi from './api';
import initApi from './api/api';
import App from './App';

import { ServiceProvider } from './contexts/services';

const api: IApi = initApi(window.location.origin);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <ServiceProvider getApi={() => api}>
        <BrowserRouter basename="/">
            <App />
        </BrowserRouter>
    </ServiceProvider>
);