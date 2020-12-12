import { Database, verbose } from 'sqlite3';
import { log } from '../../utils';
import { createVoltageReadTable } from './tables/voltage-read';
import { startVoltageReadService } from './services/voltage-read';

const sqlite3 = verbose();

let database: Database;

const createDatabase = (): void => {
  createVoltageReadTable(database);
  startVoltageReadService(database);
};

export const startDatabase = (): void => {
  database = new sqlite3.Database('sqlite.db', err => {
    if (err) {
      log('Database', err);
    } else {
      log('Database', 'Connected');
    }
  });

  createDatabase();
};
