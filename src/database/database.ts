import {DB_CONFIG} from "./config";
import {Collection, Db, MongoClient, MongoError} from "mongodb";


class DatabaseServer {

    private static readonly URL: string = 'mongodb://' + DB_CONFIG.HOST + ':' + DB_CONFIG.PORT + '/' + DB_CONFIG.DATABASE_NAME;

    public collection: Collection = null;

    constructor(private collectionName: string) {}

    public initialize(): Promise<Collection> {
        return this.connectToServer()
            .then(client => {
                return this.connectToDatabase(client, DB_CONFIG.DATABASE_NAME);
            })
            .then(db => {
                return this.createCollection(db, this.collectionName);
            })
            .then(collection => {
                console.log('DB:: initialize complete. Yeah!!');
                return collection
            })
    }

    private connectToServer(): Promise<MongoClient> {
        console.log('DB:: Connecting to mongoDB server...');

        return new Promise<MongoClient>(resolve => {
            MongoClient.connect(DatabaseServer.URL, (err: MongoError, db: MongoClient) => {
                if(err) {
                    throw err;
                }
                console.log("DB: database connection successful");
                resolve(db);
            });
        });
    }

    private connectToDatabase(client: MongoClient, dbPath: string): Db {
        console.log('DB:: Connecting to database "'+dbPath+'"...');

        return client.db(dbPath);
    }

    private createCollection(db: Db, collectionName: string): Promise<Collection> {
        console.log('DB:: Creating collection "'+collectionName+'"...');

        return new Promise<Collection>(resolve => {
            db.createCollection(collectionName, (err, res) => {
                if(err) {
                    throw err;
                }
                console.log('DB:: Collection "'+collectionName+'" created');
                resolve(this.collection = db.collection(collectionName));
            })
        });
    }
}



const _usersDatabase = new DatabaseServer('users');

export abstract class DB {

    public static initialize(): Promise<void> {
        return _usersDatabase.initialize().then(() => {});
    }

    public static get users(): Collection {
        return _usersDatabase.collection;
    }
}
