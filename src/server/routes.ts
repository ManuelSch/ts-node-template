import * as bodyParser from 'body-parser';
import {Request, Response} from "express-serve-static-core";
import {Application} from "express";
import {DB} from "../database/database";
import {InsertOneWriteOpResult, MongoError, ObjectID, UpdateWriteOpResult} from "mongodb";
import {User} from "../database/models";

export class Routes {

    constructor(app: Application) {

        app.use(bodyParser.json());

        app.get('/getUser', this.getUser);
        app.post('/createUser', this.createUser);
        app.post('/updateUser', this.updateUser);

    }

    public getUser(req: Request, res: Response): void {
        console.log(req.method + ': "' + req.path + '" with params =', req.query);

        const query = new ObjectID(req.query['_id']);

        DB.users.findOne(query, (error: MongoError, result: User) => {
            if(error) {
                res.send({ error: error });
            }
            else {
                res.send(result);
            }
        });
    }

    public createUser(req: Request, res: Response): void {
        console.log(req.method + ': "' + req.path + '"');

        const newUser: User = req.body;

        DB.users.insertOne(newUser, (error: MongoError, result: InsertOneWriteOpResult) => {
            if(error) {
                res.send({ error: error });
            }
            else {
                res.send({ ...newUser, _id: result.insertedId });
            }
        });
    }

    public updateUser(req: Request, res: Response): void {
        console.log(req.method + ': "' + req.path + '"');

        const query = { _id: new ObjectID(req.body['_id']) };

        const update = {
            $set: {}
        };
        for(let key in req.body) {
            if (key === '_id')
                continue;

            update.$set[key] = req.body[key]+'';
        }

        DB.users.updateOne(query, update, (error: MongoError, result: UpdateWriteOpResult) => {
            if(error) {
                res.send({ error: error});
            }
            else {
                res.send({ success: true });
            }
        });
    }

}