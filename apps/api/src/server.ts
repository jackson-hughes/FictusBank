import { createServer } from "./app.ts";
import closeWithGrace from "close-with-grace";

const server = createServer();

const start = async () => {
  try {
    await server.listen({
      port: 3000,
    });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();

closeWithGrace({ delay: 15000 }, async ({ signal, err }) => {
  if (err) {
    server.log.error(err);
  }
  server.log.info(`${signal} received, shutting down`);
  await server.close();
});
