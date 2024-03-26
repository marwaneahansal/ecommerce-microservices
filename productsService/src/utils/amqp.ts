import amqp from "amqplib";

const amqpConnect = async () => {
  const connection = await amqp.connect(process.env.AMQP_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue("products");
  return channel;
};

export { amqpConnect };