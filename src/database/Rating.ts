import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from "typeorm";
import { User } from "./User";
import { Task } from "./Task";

@Entity()
export class Rating {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => Task, (task) => task.ratings)
    task!: Task;

    @ManyToOne(() => User, (user) => user.ratings)
    user!: User;

    @Column({ type: "integer", check: "score >= 1 AND score <= 5" })
    score!: number;
}