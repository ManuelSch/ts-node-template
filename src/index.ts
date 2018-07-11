import {SimpleServer} from "./server/server";
import {DatabaseServer} from "./database/database";
import {iUser} from "./database/models";

const database = new DatabaseServer();
const server = new SimpleServer();

const onInitialized = Promise.all([
    database.initialize(),
    server.initialize()
]);



/**
 * Database test:
 */
onInitialized.then(() => {
    const testUser: iUser = {
        email: 'test@test.test',
        password: 'pw1234'
    };

    database.setData('/users', testUser).then(user => {
        console.log('created user =', user);

        database.getData<iUser>('/users', user.id).then(user => {
            console.log('get user = ', user)
        });
    });
});





