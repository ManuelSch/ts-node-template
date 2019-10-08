import { DB_CONFIG } from './config';
import { Client } from 'pg';
import { setTypeParser } from 'pg-types';


class DatabaseServer {

    public client: Client;

    public async initialize(): Promise<void> {

        console.log(`DB:: Connecting to database...(postgresql://${DB_CONFIG.USER}@${DB_CONFIG.HOST}:${DB_CONFIG.PORT}/${DB_CONFIG.DB_NAME})`);

        /*this._sequelize = new Sequelize({
            dialect: 'postgres',
            username: DB_CONFIG.USER,
            password: DB_CONFIG.PASSWORD,
            host: DB_CONFIG.HOST,
            port: DB_CONFIG.PORT,
            storage: ':memory:',
            database: DB_CONFIG.DB_NAME,
            models: [UserModel],
        });

        await this._sequelize.sync({ alter: true });*/

        this.client = new Client({
            user: DB_CONFIG.USER,
            password: DB_CONFIG.PASSWORD,
            host: DB_CONFIG.HOST,
            port: DB_CONFIG.PORT,
            database: DB_CONFIG.DB_NAME,
        });

        /*setTypeParser(1114, function(stringValue) {
            console.log(stringValue);
            return new Date(Date.parse(stringValue + "+0000")) + 'Z';
        });*/

        await this.client.connect();

        console.log(`DB:: Database setup successful.`);
    }
}

export const DB = new DatabaseServer();
