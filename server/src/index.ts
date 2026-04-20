import express, { Express } from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import { useGlobalEvents, useGlobalServices, initializeEventControllers } from './services';
import { useConjugationRaceEvents, useConjugationRaceServices } from './services/active/conjugation_race';
import { EventListenerService, useSocketIOEventListener } from './services/global/event_listener';
import { useSocketIOEventEmitter } from './services/global/event_emitter';
import { createConjugationRaceEventBinder, createConjugationRaceRouteBinder } from './controllers/conjugation_race';
import createGlobalEventBinder, { EventBinder } from './controllers/global';
import { usePSQLDBService } from './services/global/db_service';
import { Pool } from 'pg';
import { useExpressRequestHandler } from './services/global/request_handler';
import createGameRouteBinder from './controllers/game';

// boilerplate drivers
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

// create a socket.io server
const io = new Server(server, {
    cors: corsOptions
});

// serve static react SPA on production
if (env === 'prod') {
    app.use(express.static('build'));
    app.get('*', (req, res) => {
        res.sendFile('index.html', {root: 'build' });
    });
}

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


// initialize dependencies here

// use socket io connection
const gameNamespace = io.of('/api');

// Use node-postgres for db service
const pool = new Pool();

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
})

// DB services
const dbService = usePSQLDBService(pool);

const eventEmitter = useSocketIOEventEmitter(gameNamespace);
const globalServices = useGlobalServices(env, eventEmitter, dbService);
const conjugationRaceServices = useConjugationRaceServices(globalServices.conjugationRaceDbService);

// on each client connection, initialize an event handler service
gameNamespace.on('connection', (socket: Socket) => {
    globalServices.logger.info(`Player ${socket.id} connected`);

    // initialize the socket io player event listener service
    const eventListener: EventListenerService = useSocketIOEventListener(gameNamespace, socket);

    // initialize events
    const globalEvents = useGlobalEvents(eventListener, globalServices);
    const conjugationRaceEvents = useConjugationRaceEvents(globalServices, conjugationRaceServices);

    // create event binders
    const globalGameEventBinder: EventBinder = createGlobalEventBinder(globalServices, globalEvents);
    const conjugationRaceEventBinder: EventBinder = createConjugationRaceEventBinder(conjugationRaceEvents);
    // initialize controllers using binders
    initializeEventControllers(eventListener)(
        globalGameEventBinder,
        conjugationRaceEventBinder
    );
});

// Set up REST endpoints
const gameRouter = express.Router();
app.use('/game', gameRouter);
const requestHandler = useExpressRequestHandler(gameRouter);
createGameRouteBinder(globalServices.gameDbService)(requestHandler);

const conjugationRaceRouter = express.Router();
app.use('/conjugation', conjugationRaceRouter);
const conjugationRaceRequestHandler = useExpressRequestHandler(conjugationRaceRouter);
createConjugationRaceRouteBinder(conjugationRaceServices.dbService)(conjugationRaceRequestHandler);
