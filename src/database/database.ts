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


    // read from db:
    public getData<T extends iDatabaseData>(path: string, id?: number|string): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            request.get(DatabaseServer.URL + path + (id ? '/'+ id : ''), (error, response, body) => {
                error ? reject() : resolve(JSON.parse(body));
            });
        });
    }

    // decides on its own whether to create or update a db entry:
    public overwriteData<T extends iDatabaseData>(path: string, data: T): Promise<T> {
        if(!data.id) {
            return Database.createData<T>(path, data);
        }
        
        return new Promise<T>((resolve, reject) => {
            Database.getData<T>(path, data.id).then(oldData => {
                if(oldData && oldData.id) {
                    Database.updateData<iBook>(path, oldData.id, {...<any>oldData, ...<any>data}).then(data => resolve(<T>data));
                }
                else {
                    Database.createData<iBook>(path, data).then(data => resolve(<T>data));
                }
            });
        });
    }

    public createData<T extends iDatabaseData>(path: string, data: T): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            request.post(DatabaseServer.URL + path, { json: data }, (error, response, body) => {
                error ? reject() : resolve(body);
            });
        });
    }

    public updateData<T extends iDatabaseData>(path: string, id: number|string, data: T): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            request.put(DatabaseServer.URL + path + '/'+ id, { json: data }, (error, response, body) => {
                error ? reject() : resolve(body);
            });
        });
    }

}