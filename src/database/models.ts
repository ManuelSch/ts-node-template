interface iDatabaseModel {
    users: iUser[];              // you have to manually create these properties inside of the main object in db.json
}

export abstract class iDatabaseData {
    public id?: number;
}

export class iUser extends iDatabaseData {
    constructor(
        public email: string,
        public password: string,
    ) {
        super();
    }
}
