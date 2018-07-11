import * as JsonServer from 'json-server';
import * as request from 'request';
import {Application} from "express";
import {DB_CONFIG} from "./config";
import {iDatabaseData} from "./models";


export class DatabaseServer {

    public static readonly URL: string = 'http://' + DB_CONFIG.HOST + ':' + DB_CONFIG.PORT + DB_CONFIG.API_PATH;

    public initialize(): Promise<any> {
        const dbApp: Application = JsonServer.create();

        return this.launchServer(dbApp);
    }


    private launchServer(dbApp: Application): Promise<void> {
        console.log('DB:: starting up database server...');

        dbApp.use(JsonServer.defaults());
        dbApp.use(DB_CONFIG.API_PATH, JsonServer.router(DB_CONFIG.FILE_PATH));

        return new Promise<void>(resolve => {
            dbApp.listen(DB_CONFIG.PORT, () => {
                console.log('DB:: listening at ' + DatabaseServer.URL);
                resolve();
            });
        })
    }


    public getData<T extends iDatabaseData>(path: string, id?: number): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            request.get(DatabaseServer.URL + path + (id ? '/'+ id : ''), (error, response, body) => {
                error ? reject() : resolve(body);
            });
        });
    }

    public setData<T extends iDatabaseData>(path: string, data: T): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            request.post(DatabaseServer.URL + path, { json: data }, (error, response, body) => {
                error ? reject() : resolve(body);
            });
        });

    }

}