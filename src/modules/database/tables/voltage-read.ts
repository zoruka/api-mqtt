import { Database } from 'sqlite3';

export const createVoltageReadTable = (database: Database): void => {
  database.run(`
        CREATE TABLE IF NOT EXISTS voltageRead (
            id INTEGER PRIMARY KEY,
            value INTEGER NOT NULL,
            date INTEGER NOT NULL
        );
    `);
};
