import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
// import * as http from 'http';
import { Server } from 'http';

var serverRunning = false;
var server: Server 
export function startServer(restart = false) {
  try {
    if (!restart && serverRunning) {
      return;
    }

    dotenv.config();

    const PORT = process.env.PORT || 3000;
    const app = express();

    app.use(helmet());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get('/', (req: Request, res: Response) => {
      res.send('<h1>Hello from the TypeScript world!</h1>');
    });


    var server: Server = app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`));

    // Graceful close.
    process.on('SIGTERM', () => {
      console.debug('SIGTERM signal received: closing HTTP server');
      stopServer();      
    });

  } catch (error) {
    serverRunning = false;
    console.error('[Server] could not be started!', error);
  }
}

// Stop Server
export function stopServer() {
  try {
    server.close(() => {
      serverRunning = false;
      console.debug('HTTP server closed')
    });
  } catch (error) {
    console.error('[Server] could not be stopped!', error);
  }
}