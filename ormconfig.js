const pathToEntities = process.env.NODE_ENV == 'production' ? './dist/**/**.entity.js' : 'src/**/**.entity.ts';
const pathToMigrations = process.env.NODE_ENV == 'production' ? [] : ["./migration/*.ts"]

module.exports = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'availability',
    port: parseInt(process.env.DB_PORT) || 5432,
    entities: [
        pathToEntities
    ],
    logging: Boolean(process.env.DB_LOGGING),
    migrationsTableName: "kudos_migration_table",
    migrations: pathToMigrations,
    synchronize: Boolean(process.env.DB_SYNCHRONIZE),
    cli: {
        "migrationsDir": "./migration",
    }
};