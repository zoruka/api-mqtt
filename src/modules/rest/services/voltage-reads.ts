import { RequestHandler } from 'express';
import { requestVoltageRead } from '../../database/services/voltage-read';

export const voltageReadsHandler: RequestHandler = (req, res): void => {
  const parsedCount = parseInt(`${req.query.count}`);
  const count = isNaN(parsedCount) ? 5 : parsedCount;

  requestVoltageRead(count)
    .then(lastReads => res.send({ lastReads }))
    .catch(() => res.sendStatus(400));
};
