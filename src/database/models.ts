abstract class DatabaseData {
    public _id?: number;
}

export class User extends DatabaseData {
    constructor(
        public email: string,
        public password: string,
    ) {
        super();
    }
}
