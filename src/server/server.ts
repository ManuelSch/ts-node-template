import * as express from "express";
import {Application} from "express";
import {Server} from "http";
import {CONFIG} from "./config";
import {Routes} from "./routes";


export class SimpleServer {

    constructor() {
        const app: Application = express();

        this.setupRoutes(app);
        this.launchServer(app, CONFIG.HOST, CONFIG.PORT);
    }

    private setupRoutes(app: Application): Routes {
        return new Routes(app);
    }

    private launchServer(app: Application, host: string, port: string): Server {
        console.log('Starting up server...');

        return app.listen(CONFIG.PORT, () => {
            console.log('App listening at http://' + host + ':' + port);
        });
    }

}