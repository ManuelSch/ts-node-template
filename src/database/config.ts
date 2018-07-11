class DatabaseConfig {

    readonly HOST: string = 'localhost';
    readonly API_PATH: string = '/api';
    readonly PORT: string = '3000';
    readonly FILE_PATH: string = 'database/db.json';

}

export const DB_CONFIG = new DatabaseConfig();
