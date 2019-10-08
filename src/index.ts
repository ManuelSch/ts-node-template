import { SimpleServer } from './server/server';
import { DB } from './database/database';

console.clear();

(async () => {
    const server = new SimpleServer();

    await DB.initialize();
    await server.initialize();


    // ...
})();
