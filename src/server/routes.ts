import * as bodyParser from 'body-parser';
import { Request, Response } from 'express-serve-static-core';
import { Application } from 'express';
import { DB } from '../database/database';
const Big = require('big.js');

const fromUTC = date => {
    const _date = new Date(date);
    _date.setHours(_date.getHours() + 2);
    return _date;
};

// https://stackoverflow.com/a/13227451/6805758
const json_build_object = row => row.json_build_object;


export class Routes {

    constructor(app: Application) {

        app.use(bodyParser.json());

        app.post('/user', this.createUser);
        app.get('/user/:id', this.getUser);
        app.get('/user', this.getAllUsers);

        app.post('/comment', this.createComment);
        app.get('/comment/:id', this.getComment);
        app.get('/comment', this.getAllComments);

        app.get('/ping', this.ping);

    }

    async createUser(req: Request, res: Response) {
        console.log(`${req.method}: "${req.path}" with body =`, req.body);

        try {
            const { email, password } = req.body;

            if(!email || !password) {
                res.status(404).end();
                return;
            }

            const createdUser = await DB.client.query(`
                INSERT INTO users(email, password, created)
                VALUES($1, $2, now() at time zone 'utc')
                RETURNING id, email, password, timezone('UTC'::text, created) as created
            `, [ email, password ]);

            res.send(createdUser.rows[0]);
        }
        catch (e) {
            res.status(404).end();
        }
    }

    async getUser(req: Request, res: Response) {
        console.log(`${req.method}: "${req.path}" with params =`, req.params);

        const { id } = req.params;

        const foundUser = await DB.client.query(`
                SELECT json_build_object(
                    'id', u.id,
                    'email', u.email,
                    'password', u.password,
                    'created', u.created
                )
                FROM users u
                WHERE u.id = $1
            `, [ id ]);

        if (foundUser.rows.length > 0) {
            res.send(foundUser.rows.map(json_build_object).map(row => ({
                ...row,
                created: fromUTC(row.created),
            }))[0]);
        }
        else {
            res.status(404).end();
        }
    }

    async getAllUsers(req: Request, res: Response) {
        console.log(`${req.method}: "${req.path}"`);

        const foundUsers = await DB.client.query(`
                SELECT json_build_object(
                    'id', u.id,
                    'email', u.email,
                    'password', u.password,
                    'created', u.created
                )
                FROM users u
            `);

        res.send(foundUsers.rows.map(json_build_object).map(row => ({
            ...row,
            created: fromUTC(row.created),
        })));
    }

    async createComment(req: Request, res: Response) {
        console.log(`${req.method}: "${req.path}" with body =`, req.body);

        try {
            const { content, user_id } = req.body;

            if(!content || !user_id) {
                res.status(404).end();
                return;
            }

            const foundUser = await DB.client.query(`
                SELECT json_build_object(
                    'id', u.id,
                    'email', u.email,
                    'password', u.password,
                    'created', u.created
                )
                FROM users u
                WHERE u.id = $1
            `, [ user_id ]);

            const createdComment = await DB.client.query(`
                INSERT INTO comments(content, user_id, created)
                VALUES($1, $2, now() at time zone 'utc')
                RETURNING id, content, timezone('UTC'::text, created) as created
            `, [ content, user_id ]);

            res.send(createdComment.rows.map(row => ({
                ...row,
                user: foundUser.rows.map(json_build_object).map(row => ({
                    ...row,
                    created: fromUTC(row.created),
                }))[0]
            }))[0]);
        }
        catch (e) {
            res.status(404).end();
        }
    }

    async getComment(req: Request, res: Response) {
        console.log(`${req.method}: "${req.path}" with params =`, req.params);

        const { id } = req.params;

        const foundComment = await DB.client.query(`
                SELECT json_build_object(
                    'id', c.id,
                    'content', c.content,
                    'created', c.created,
                    'user', json_build_object(
                        'id', u.id,
                        'email', u.email,
                        'password', u.password,
                        'created', u.created
                    )
                )
                FROM comments c
                INNER JOIN users u on c.user_id = u.id
                WHERE c.id = $1
            `, [ id ]);

        if (foundComment.rows.length > 0) {
            res.send(foundComment.rows.map(json_build_object).map(row => ({
                ...row,
                created: fromUTC(row.created),
                user: {
                    ...row.user,
                    created: fromUTC(row.user.created),
                }
            }))[0]);
        }
        else {
            res.status(404).end();
        }
    }

    async getAllComments(req: Request, res: Response) {
        console.log(`${req.method}: "${req.path}"`);

        const foundComment = await DB.client.query(`
                SELECT json_build_object(
                    'id', c.id,
                    'content', c.content,
                    'created', c.created,
                    'user', json_build_object(
                        'id', u.id,
                        'email', u.email,
                        'password', u.password,
                        'created', u.created
                    )
                )
                FROM comments c
                INNER JOIN users u on c.user_id = u.id
            `);

        res.send(foundComment.rows.map(json_build_object).map(row => ({
            ...row,
            created: fromUTC(row.created),
            user: {
                ...row.user,
                created: fromUTC(row.user.created),
            }
        })));
    }


    async ping(req: Request, res: Response) {
        console.log(`${req.method}: "${req.path}"`);

        let result = new Big(0);
        result = result.plus(new Big(0.00002).times(13));
        result = result.plus(new Big(1.4).times(1000000000000000000000000000000000000000000000000000000000000000));

        res.set('Content-Type', 'text/plain').send(result.toFixed());
    }
}
