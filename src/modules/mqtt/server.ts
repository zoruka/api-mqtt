import * as aedes from 'aedes';
import * as net from 'net';
import { log } from '../../utils';

const port = 1883;
const hostName = '0.0.0.0';

const aedesServer = aedes.Server();
const httpServer = net.createServer(aedesServer.handle);

const getIdOrServer = (client?: aedes.Client) => {
  return client ? client.id : 'SERVER';
};

export const startBroker = (): {
  net: net.Server;
  mqtt: aedes.Aedes;
} => {
  aedesServer.on('client', client => {
    log('MQTT', 'Client Connected:', client.id);
  });

  aedesServer.on('clientDisconnect', client => {
    log('MQTT', 'Client Disconnected:', client.id);
  });

  aedesServer.on('publish', (packet, client) => {
    if (packet.topic.endsWith('heartbeat')) return;
    if (packet.topic.endsWith('clients')) return;
    log('MQTT', `${getIdOrServer(client)}[${packet.topic}]`, packet.payload.toString());
  });

  aedesServer.on('subscribe', (packet, client) => {
    log('MQTT', `Subscribe:${getIdOrServer(client)}`, packet);
  });

  aedesServer.on('unsubscribe', (packet, client) => {
    log('MQTT', `Subscribe:${getIdOrServer(client)}`, packet);
  });

  httpServer.listen(port, hostName, () => {
    log('MQTT', 'Broker Started On:', `${hostName}:${port}`);
  });

  return { net: httpServer, mqtt: aedesServer };
};

export const publish = (topic: string, payload: string | Buffer): Promise<void> => {
  if (aedesServer.closed) throw new Error('Server is closed!');

  const packet: aedes.PublishPacket = {
    topic,
    payload,
    cmd: 'publish',
    dup: false,
    qos: 0,
    retain: false,
  };

  return new Promise((resolve, reject) => {
    aedesServer.publish(packet, error => {
      if (error) return reject(error);
      else return resolve();
    });
  });
};

export const subscribe = (
  topic: string,
  listener: (packet: aedes.AedesPublishPacket, callback: () => void) => void
): Promise<void> => {
  if (aedesServer.closed) throw new Error('Server is closed!');

  return new Promise(resolve => {
    aedesServer.subscribe(topic, listener, resolve);
  });
};
