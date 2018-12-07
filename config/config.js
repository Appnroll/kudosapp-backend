module.exports = {
    'development': {
        'username': process.env.DB_USER || 'postgres',
        'password': process.env.DB_PASSWORD || '',
        'database': process.env.DB_NAME || 'database_dev',
        'host': process.env.DB_HOST || '127.0.0.1',
        'dialect': 'postgres'
    },
    'test': {
        'username': process.env.DB_USER || 'postgres',
        'password': process.env.DB_PASSWORD || 'root',
        'database': process.env.DB_NAME || 'database_test',
        'host': process.env.DB_HOST || '127.0.0.1',
        'dialect': 'postgres'
    },
    'production': {
        'username': process.env.DB_USER || 'postgres',
        'password': process.env.DB_PASSWORD || 'root',
        'database': process.env.DB_NAME || 'database_prod',
        'host': process.env.DB_HOST || '127.0.0.1',
        'dialect': 'postgres',
        "ssl": true,
        "dialectOptions": {
            "ssl": true
        }
    }
}
