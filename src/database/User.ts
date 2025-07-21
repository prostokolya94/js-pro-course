import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    BeforeInsert,
} from "typeorm";
import { Task } from "./Task";
import { Comment } from "./Comment";
import { Rating } from "./Rating";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ unique: true })
    username!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    password_hash!: string;

    @Column({
        type: "enum",
        enum: ["admin", "interviewer", "user"],
        default: "user"
    })
    role!: "admin" | "interviewer" | "user";

    @Column({ type: "float", default: 0 })
    rating!: number;

    @OneToMany(() => Task, (task) => task.author)
    tasks!: Task[];

    @OneToMany(() => Comment, (comment) => comment.user)
    comments!: Comment[];

    @OneToMany(() => Rating, (rating) => rating.user)
    ratings!: Rating[];
}