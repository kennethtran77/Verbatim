import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Background from './components/Background/Background';
import { useServices } from './contexts/services';
import CreateGame from './pages/CreateGame/CreateGame';
import GamePage from './pages/GamePage/GamePage';
import Home from './pages/Home/Home';
import JoinGame from './pages/JoinGame/JoinGame';

function App() {
    const { getApi } = useServices();
    const location = useLocation();

    useEffect(() => {
        // detect route changes
        if (location && !location.pathname.startsWith(`/game`)) {
            getApi().leaveGame();
        }
    }, [location, getApi])

    return (
        <Background>
            <Routes>
                <Route path='/create' element={<CreateGame />} />
                <Route path='/join' element={<JoinGame />} />
                <Route path='/game/:gameCode' element={<GamePage />} />
                <Route path='*' element={<Home />} />
            </Routes>
        </Background>
    );
}

export default App;
