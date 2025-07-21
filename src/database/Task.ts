import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
} from "typeorm";
import { User } from "./User";
import { Comment } from "./Comment";
import { Rating } from "./Rating";

@Entity()
export class Task {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    title!: string;

    @Column()
    description!: string;

    @ManyToOne(() => User, (user) => user.tasks)
    author!: User;

    @OneToMany(() => Comment, (comment) => comment.task)
    comments!: Comment[];

    @OneToMany(() => Rating, (rating) => rating.task)
    ratings!: Rating[];
}