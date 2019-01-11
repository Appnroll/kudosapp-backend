module.exports = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'mamatomojamama1',
    database: process.env.DB_NAME || 'kudos',
    port: parseInt(process.env.DB_PORT) || 5432,
    entities: [
        "src/kudos/model/**.ts"
    ],
    logging: true,
    migrationsTableName: "kudos_migration_table",
    migrations: ["./migration/*.ts"],
    cli: {
        "migrationsDir": "./migration",
    }
};