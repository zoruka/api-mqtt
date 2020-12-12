import { RequestHandler } from 'express';
import { publish } from '../../mqtt';

export const setStateHandler: RequestHandler = (req, res): void => {
  const state = req.body.state;

  if (state !== undefined) {
    const value = state ? '1' : '0';
    publish('state', Buffer.from(value));
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
};
