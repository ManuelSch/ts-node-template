class DatabaseConfig {

    readonly USER = 'postgres';
    readonly PASSWORD = 'password';
    readonly HOST = 'localhost';
    readonly PORT = 5432;
    readonly DB_NAME = 'test';

}

export const DB_CONFIG = new DatabaseConfig();
