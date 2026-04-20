import express, { Express } from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { createGameEvents, createGameServices } from './features/game';
import { createConjugationRaceEvents, createConjugationRaceServices } from './features/conjugation-race';
import createGameEventBinder from './features/game/controllers/socket';
import createGameRouteBinder from './features/game/controllers/rest';
import { createConjugationRaceEventBinder } from './features/conjugation-race/controllers/socket';
import { createConjugationRaceRouteBinder } from './features/conjugation-race/controllers/rest';
import { EventListenerService } from './ports/event_listener';
import { createSocketIOEventListener } from './adapters/socket_io/event_listener';
import { createSocketIOEventEmitter } from './adapters/socket_io/event_emitter';
import { createPSQLDBService } from './adapters/postgres/db_service';
import { createExpressRequestHandler } from './adapters/express/request_handler';

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

const io = new Server(server, {
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

const dbService = createPSQLDBService(pool);
const eventEmitter = createSocketIOEventEmitter(gameNamespace);

// Feature services
const gameServices = createGameServices(env, eventEmitter, dbService);
const conjugationRaceServices = createConjugationRaceServices(gameServices.conjugationRaceDbService);

// Socket.IO: bind event handlers per connection
gameNamespace.on('connection', (socket: Socket) => {
    gameServices.logger.info(`Player ${socket.id} connected`);

    const eventListener: EventListenerService = createSocketIOEventListener(gameNamespace, socket);

    const gameEvents = createGameEvents(eventListener, gameServices);
    const conjugationRaceEvents = createConjugationRaceEvents(gameServices, conjugationRaceServices);

    createGameEventBinder(gameServices, gameEvents)(eventListener);
    createConjugationRaceEventBinder(conjugationRaceEvents)(eventListener);
});

// REST: register routes on mounted routers
const gameRouter = express.Router();
app.use('/game', gameRouter);
createGameRouteBinder(gameServices.gameDbService)(createExpressRequestHandler(gameRouter));

const conjugationRaceRouter = express.Router();
app.use('/conjugation', conjugationRaceRouter);
createConjugationRaceRouteBinder(conjugationRaceServices.dbService)(createExpressRequestHandler(conjugationRaceRouter));
