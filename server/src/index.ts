import express, { Express } from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors, { CorsOptions } from 'cors';
import { ClientToServerEvents, ServerToClientEvents } from '../../shared/events';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { createGameEvents, createGameContext, Repositories } from './features/game';
import { createConjugationRaceEvents, createConjugationRaceServices } from './features/conjugation-race';
import createGameEventBinder from './features/game/controllers/socket';
import createGameRouteBinder from './features/game/controllers/rest';
import { createConjugationRaceEventBinder } from './features/conjugation-race/controllers/socket';
import { createConjugationRaceRouteBinder } from './features/conjugation-race/controllers/rest';
import { EventListenerService } from './ports/event_listener';
import { createSocketIOEventListener } from './adapters/socket_io/event_listener';
import { createSocketIOEventEmitter } from './adapters/socket_io/event_emitter';
import { createExpressRequestHandler } from './adapters/express/request_handler';
import createMemLiveGameRepository from './features/game/services/live_repository';
import createPostgresConjugationRaceRepository from './features/conjugation-race/adapters/postgres';
import createPostgresGameRepository from './features/game/adapters/postgres';

dotenv.config();

const PORT = process.env.PORT || 8000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const env = process.env.ENV as 'dev' | 'prod';

const corsOptions: CorsOptions = {
    credentials: true,
    origin: [FRONTEND_URL, 'https://admin.socket.io']
};

const app: Express = express();
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors(corsOptions));

const server: http.Server = http.createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
    cors: corsOptions
});

// serve static react SPA on production
if (env === 'prod') {
    app.use(express.static('build'));
    app.get('*', (req, res) => {
        res.sendFile('index.html', { root: 'build' });
    });
}

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Adapters
const gameNamespace = io.of('/api');
const pool = new Pool();

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

const eventEmitter = createSocketIOEventEmitter(gameNamespace);

// Repositories
const liveGameRepository = createMemLiveGameRepository();
const gameRepository = createPostgresGameRepository(pool);
const conjugationRaceRepository = createPostgresConjugationRaceRepository(pool, gameRepository);
const repositories: Repositories = {
    liveGameRepository,
    gameRepository,
    conjugationRaceRepository,
};

// Feature services
const gameContext = createGameContext(env, eventEmitter, repositories);
const conjugationRaceServices = createConjugationRaceServices(conjugationRaceRepository);

// Socket.IO: bind event handlers per connection
gameNamespace.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
    gameContext.logger.info(`Player ${socket.id} connected`);

    const eventListener: EventListenerService = createSocketIOEventListener(socket);

    const gameEvents = createGameEvents(eventListener, gameContext);
    const conjugationRaceEvents = createConjugationRaceEvents(gameContext, conjugationRaceServices);

    createGameEventBinder(gameContext, gameEvents)(eventListener);
    createConjugationRaceEventBinder(conjugationRaceEvents)(eventListener);
});

// REST: register routes on mounted routers
const gameRouter = express.Router();
app.use('/game', gameRouter);
createGameRouteBinder(gameRepository)(createExpressRequestHandler(gameRouter));

const conjugationRaceRouter = express.Router();
app.use('/conjugation', conjugationRaceRouter);
createConjugationRaceRouteBinder(conjugationRaceRepository)(createExpressRequestHandler(conjugationRaceRouter));
