// lib/rabbit-connection.ts
import amqp, { type ChannelModel, type Channel } from 'amqplib';

let connection: ChannelModel | null = null;
let channel: Channel | null = null;

async function getChannel(): Promise<amqp.Channel> {
  if (channel) {
    return channel;
  }
  connection = await amqp.connect(process.env.RABBITMQ_URL || '');
  channel = await connection.createChannel();
  await channel.assertQueue('notifications_queue', { durable: true });
  return channel;
}

export async function publishEvent(
  pattern: string,
  data: Record<string, unknown>,
) {
  const ch = await getChannel();
  ch.sendToQueue(
    'notifications_queue',
    Buffer.from(JSON.stringify({ pattern, data })),
    { persistent: true },
  );
}
