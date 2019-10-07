import * as bodyParser from 'body-parser';
import { Request, Response } from 'express-serve-static-core';
import { Application } from 'express';
import { UserModel } from '../database/models/user.model';
import { UpdateOptions } from 'sequelize';

export class Routes {

    constructor(app: Application) {

        app.use(bodyParser.json());

        app.get('/user', this.getUser);
        app.post('/user', this.createUser);
        app.put('/user', this.updateUser);

    }

    public async getUser(req: Request, res: Response) {
        console.log(`${req.method}: "${req.path}" with params =`, req.query);

        const { id } = UserModel.fromRequestBodyPartial(req.query);

        const foundUser = await UserModel.findByPk(id);

        if (foundUser) {
            res.send(foundUser);
        }
        else {
            res.status(404).send({ success: false, msg: 'UserModel not found' });
        }
    }

    public async createUser(req: Request, res: Response) {
        console.log(`${req.method}: "${req.path}"`);

        try {
            const { id, ...userData } = UserModel.fromRequestBody(req.body);

            const newUser = new UserModel(userData);
            const createdUser = await newUser.save();

            res.send(createdUser);
        }
        catch (e) {
            res.status(404).send({ success: false, msg: 'User could not be created' });
        }
    }

    public async updateUser(req: Request, res: Response) {
        console.log(`${req.method}: "${req.path}"`);

        try {
            const { id, ...updatedUserData } = UserModel.fromRequestBodyPartial(req.body);

            const query: UpdateOptions = {
                where: {
                    id,
                },
            };

            await UserModel.update(updatedUserData, query);
            res.send({ success: true });
        }
        catch (e) {
            res.status(404).send({ success: false, msg: 'UserModel could not be updated' });
        }
    }

}
