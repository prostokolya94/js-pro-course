import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from "typeorm";
import { User } from "./User";
import { Task } from "./Task";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    text!: string;

    @ManyToOne(() => Task, (task) => task.comments)
    task!: Task;

    @ManyToOne(() => User, (user) => user.comments)
    user!: User;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at!: Date;
}