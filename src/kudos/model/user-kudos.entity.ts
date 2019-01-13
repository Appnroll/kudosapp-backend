import {
    CreateDateColumn,
    Entity, JoinColumn,
    ManyToOne, OneToMany, OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "./user.entity";
import {Kudos} from "./kudos.entity";

@Entity()
export class UserKudosEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.givenKudos)
    from: User;

    @ManyToOne(type => User, user => user.userKudos)
    user: User;

    @ManyToOne(type => Kudos, kudos => kudos.userKudos)
    kudos: Kudos;

    @PrimaryColumn()
    @CreateDateColumn({type: 'date'})
    createdAt: Date;

    @UpdateDateColumn({type: 'date'})
    updatedAt: Date;
}
