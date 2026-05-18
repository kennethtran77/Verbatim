import express, { Express } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors, { CorsOptions } from 'cors';
import { ClientToServerEvents, ServerToClientEvents } from '@verbatim/shared/events';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { createGameEvents, createGameContext, Repositories } from './features/game';
import { createConjugationRaceEvents } from './features/conjugation-race';
import createGameEventBinder from './features/game/controllers/socket';
import createGameRouteBinder from './features/game/controllers/rest';
import { createConjugationRaceEventBinder } from './features/conjugation-race/controllers/socket';
import { createConjugationRaceRouteBinder } from './features/conjugation-race/controllers/rest';
import { EventBinder, EventListenerService } from './ports/event_listener';
import { createSocketIOEventListener } from './adapters/socket_io/event_listener';
import { createSocketIOEventEmitter } from './adapters/socket_io/event_emitter';
import { createExpressRequestHandler } from './adapters/express/request_handler';
import createMemLiveGameRepository from './features/game/services/live_repository';
import createPostgresConjugationRaceRepository from './features/conjugation-race/adapters/postgres';
import createPostgresGameRepository from './features/game/adapters/postgres';
import { RequestHandlerService, RouteBinder } from './ports/request_handler';

dotenv.config();

const PORT = process.env.PORT || 8000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const env = process.env.ENV as 'dev' | 'prod';

const corsOptions: CorsOptions = {
    credentials: true,
    origin: [FRONTEND_URL, 'https://admin.socket.io']
};

const app: Express = express();
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors(corsOptions));

const server: http.Server = http.createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
    cors: corsOptions
});

// serve static react SPA on production
if (env === 'prod') {
    app.use(express.static('dist/public'));
    app.get('*', (req, res) => {
        res.sendFile('index.html', { root: 'dist/public' });
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

// Socket.IO: bind event handlers per connection
gameNamespace.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
    gameContext.logger.info(`Player ${socket.id} connected`);

    const eventListener: EventListenerService = createSocketIOEventListener(socket);

    const gameEvents = createGameEvents(
        eventListener,
        gameContext
    );
    const conjugationRaceEvents = createConjugationRaceEvents(
        gameContext
    );

    let gameEventBinder: EventBinder = createGameEventBinder(
        gameContext,
        gameEvents
    );
    let conjugationRaceEventBinder: EventBinder = createConjugationRaceEventBinder(
        conjugationRaceEvents
    );

    // Bind event handlers to events
    gameEventBinder(eventListener);
    conjugationRaceEventBinder(eventListener);
});

// REST: register routes on mounted routers
const gameRouter = express.Router();
app.use('/game', gameRouter);
let gameRouteBinder: RouteBinder = createGameRouteBinder(gameRepository);
let expressGameRequestHandler: RequestHandlerService = createExpressRequestHandler(gameRouter);
// Bind express request handler to game routes
gameRouteBinder(expressGameRequestHandler);

const conjugationRaceRouter = express.Router();
app.use('/conjugation', conjugationRaceRouter);
let conjugationRaceRouteBinder: RouteBinder = createConjugationRaceRouteBinder(
    conjugationRaceRepository
);
let expressConjugationRaceRequestHandler: RequestHandlerService = createExpressRequestHandler(
    conjugationRaceRouter
);
// Bind express request handler to game routes
conjugationRaceRouteBinder(expressConjugationRaceRequestHandler);
