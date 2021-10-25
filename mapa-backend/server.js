require("dotenv").config();
const app = require("./app");
const connectDb = require("./db/mongodb");
const { appConfig, dbConfig } = require("./config");

async function initApp(appConfig, dbConfig) {
  try {
    console.log(dbConfig);
    await connectDb(dbConfig);
    app.listen(appConfig.port, () =>
      console.log(`listen on ${appConfig.port}`)
    );
  } catch (e) {
    console.error(e);
    process.exit(0);
  }
}

// Inicializar la aplicacion.

initApp(appConfig, dbConfig);
