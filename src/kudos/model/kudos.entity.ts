import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {UserKudosEntity} from "./user-kudos.entity";

@Entity()
export class Kudos {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    description: string;

    @CreateDateColumn({type: 'date'})
    createdAt: Date;

    @UpdateDateColumn({type: 'date'})
    updatedAt: Date;

    @OneToMany(type => UserKudosEntity, userKudos => userKudos.kudos)
    userKudos: UserKudosEntity[];
}
