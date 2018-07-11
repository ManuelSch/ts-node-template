import {Request, Response} from "express-serve-static-core";
import {Application} from "express";


export class Routes {

    constructor(app: Application) {

        app.get('/', this.getHome);
        app.get('/test', this.getTest);

    }

    public getHome(req: Request, res: Response): void {
        console.log('GET: "/"');
        res.send({ home: 'home' });
    }

    public getTest(req: Request, res: Response): void {
        console.log('GET: "/test", params =', req.query);
        res.send({ test: 'someData' });
    }

}