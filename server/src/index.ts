import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import { useGlobalEvents, useGlobalServices, composeControllers } from './services';
import { useConjugationRaceEvents, useConjugationRaceServices } from './services/active/conjugation_race';
import { EventListenerService, useSocketIOEventListener } from './services/global/event_listener';
import { useSocketIOEventEmitter } from './services/global/event_emitter';
import useConjugationRaceGame from './controllers/conjugation_race';
import useGlobalController, { Controller } from './controllers/global';

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

app.get('/api', (req: Request, res: Response) => {
    res.status(200).send("Connected to Verbatim API");
});

// serve static react SPA
app.use(express.static('build'));
app.get('*', (req, res) => {
    res.sendFile('index.html', {root: 'build' });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// use socket io connection
const gameNamespace = io.of('/game');

// initialize dependencies here
const eventEmitter = useSocketIOEventEmitter(gameNamespace);
const globalServices = useGlobalServices(env, eventEmitter);
const conjugationRaceServices = useConjugationRaceServices();

// on each client connection, initialize an event handler service
gameNamespace.on('connection', (socket: Socket) => {
    globalServices.logger.info(`Player ${socket.id} connected`);

    // initialize the socket io player event listener service
    const eventListener: EventListenerService = useSocketIOEventListener(gameNamespace, socket);

    // initialize events
    const globalEvents = useGlobalEvents(eventListener, globalServices);
    const conjugationRaceEvents = useConjugationRaceEvents(globalServices, conjugationRaceServices);

    // initialize the controllers
    const gameController: Controller = useGlobalController(globalServices, globalEvents);
    const conjugationRaceGameController: Controller = useConjugationRaceGame(globalServices, conjugationRaceServices, conjugationRaceEvents);

    composeControllers(eventListener)(
        gameController,
        conjugationRaceGameController
    );
});