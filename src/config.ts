module.exports = {
    server: {
        port: process.env.PORT || 3000
    },
    database: {
        url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/tasks_db'
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key'
    }
};