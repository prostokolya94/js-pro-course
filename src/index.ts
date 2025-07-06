const fastify = require('fastify')({
    logger: true,
    ignoreTrailingSlash: true
});

fastify.register(require('./routes/auth'));
fastify.register(require('./routes/users'));
fastify.register(require('./routes/tasks'));
fastify.register(require('./routes/comments'));
fastify.register(require('./routes/ratings'));

fastify.addHook('onRequest', async (request, reply) => {
    reply.header('Access-Control-Allow-Origin', '*');
    reply.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
});

const startServer = async () => {
    try {
        await fastify.listen({
            port: process.env.PORT || 3000,
            host: '0.0.0.0'
        });

        console.log(`Server running at ${fastify.server.address().port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

startServer();