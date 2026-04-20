const { MongoMemoryServer } = require("mongodb-memory-server");

async function start() {
  const mongod = await MongoMemoryServer.create({
    instance: {
      ip: "127.0.0.1",
      port: 27017,
      dbName: "dmc_admin",
    },
  });

  console.log(`Mongo memory server running at ${mongod.getUri()}`);

  const shutdown = async () => {
    await mongod.stop();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
