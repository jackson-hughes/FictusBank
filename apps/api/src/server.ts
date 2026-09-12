import closeWithGrace from "close-with-grace";

import { createServer } from "./app.ts";
import { envConfig } from "./config.ts";

const server = createServer();

const start = async () => {
  try {
    await server.listen({
      port: envConfig.PORT,
    });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
await start();

closeWithGrace({ delay: 15000 }, async ({ signal, err }) => {
  if (err) {
    server.log.error(err);
  }
  server.log.info(`${signal} received, shutting down`);
  await server.close();
});
