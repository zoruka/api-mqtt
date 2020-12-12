import express from 'express';
import { log } from '../../utils';
import { voltageReadsHandler } from './services';
import { setStateHandler } from './services/set-state';

const port = 3000;
const hostname = 'localhost';
const server = express();

server.get('/voltage-read', voltageReadsHandler);
server.post('/set-state', express.json(), setStateHandler);

export const startRestServer = (): void => {
  server.listen(port, hostname, () => {
    log('Rest', 'Server Started On:', `${hostname}:${port}`);
  });
};
