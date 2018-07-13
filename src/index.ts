import {SimpleServer} from "./server/server";
import {DB} from "./database/database";

const server = new SimpleServer();

const onInitialized = DB.initialize()
    .then(() =>
        server.initialize()
    );


onInitialized.then(() => {

    // ...

});