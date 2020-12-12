import { startDatabase } from './modules/database';
import { startBroker } from './modules/mqtt';
import { startRestServer } from './modules/rest';

startBroker();
startRestServer();
startDatabase();
