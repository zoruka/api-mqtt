import { Database, RunResult } from 'sqlite3';
import { log } from '../../../utils';
import { subscribe } from '../../mqtt';

let database: Database | undefined;

export const startVoltageReadService = (db: Database) => {
  database = db;
  subscribe('current-value', (packet, cb) => {
    const value = parseInt(packet.payload.toString());
    const date = new Date().getTime();

    log('Voltage Read Service', '[New Read]', `Value=${value}`, `Date=${new Date(date).toLocaleString()}`);
    db.run(
      `
        INSERT INTO voltageRead (value, date) VALUES (${value}, ${date})
    `
    );
  });
};

export const requestVoltageRead = (count: number) => {
  return new Promise((resolve, reject) => {
    database.all(
      `
      SELECT * FROM voltageRead ORDER BY id DESC LIMIT ${count}
    `,
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
  });
};
