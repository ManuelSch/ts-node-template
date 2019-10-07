import { DB_CONFIG } from './config';
import { Sequelize } from 'sequelize-typescript';
import { UserModel } from './models/user.model';


class DatabaseServer {

    private _sequelize: Sequelize;

    public get sequelize(): Sequelize {
        console.assert(this._sequelize, 'DB:: not yet initialized');
        return this._sequelize;
    }

    public async initialize(): Promise<void> {

        console.log(`DB:: Connecting to database...(postgresql://${DB_CONFIG.USER}@${DB_CONFIG.HOST}:${DB_CONFIG.PORT}/${DB_CONFIG.DB_NAME})`);

        this._sequelize = new Sequelize({
            dialect: 'postgres',
            username: DB_CONFIG.USER,
            password: DB_CONFIG.PASSWORD,
            host: DB_CONFIG.HOST,
            port: DB_CONFIG.PORT,
            storage: ':memory:',
            database: DB_CONFIG.DB_NAME,
            models: [UserModel],
        });

        await this._sequelize.sync({ alter: true });

        console.log(`DB:: Database setup successful.`);
    }
}

export const DB = new DatabaseServer();
