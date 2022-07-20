import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import CreateGame from './pages/CreateGame/CreateGame';
import Home from './pages/Home/Home';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='*' element={<Home />} />
                <Route path='/create' element={<CreateGame />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
