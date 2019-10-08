/*
import { Column, DataType, Model, Table } from 'sequelize-typescript';

export interface iUser {
    id: number;
    email: string;
    password: string;
}

@Table({
    modelName: 'users',
})
export class User extends Model<User> implements iUser {

    @Column({
        primaryKey: true,
        unique: true,
        autoIncrement: true,
        allowNull: false,
    })
    id: number;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password: string;


    public static fromRequestBody(body: any): User {
        return {
            id: parseInt(body.id),
            email: (body.email || '').toString(),
            password: (body.password || '').toString(),
        };
    }

    public static fromRequestBodyPartial(body: any): Partial<User> {
        const result: Partial<User> = {};

        if(body.id !== undefined) {
            result.id = parseInt(body.id);
        }

        if(body.email !== undefined) {
            result.email = (body.email || '').toString();
        }

        if(body.password !== undefined) {
            result.password = (body.password || '').toString();
        }

        return result;
    }
}
*/
