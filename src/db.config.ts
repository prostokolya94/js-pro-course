import plugin from "typeorm-fastify-plugin";
import {FastifyInstance} from "fastify";
import {User} from "src/database/User";
import {Task} from "src/database/Task";
import {Rating} from "src/database/Rating";

export async function configureDatabase(server: FastifyInstance) {
    await server.register(plugin, {
        type: "postgres",
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || "5432"),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        synchronize: process.env.NODE_ENV === "development",
        logging: process.env.NODE_ENV === "development",
        entities: [
            User,
            Task,
            Comment,
            Rating
        ],
    });
}