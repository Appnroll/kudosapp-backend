import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "./user.entity";

@Entity()
export class Kudos {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(type => User)
    @JoinColumn()
    from: User;

    @Column('text')
    description: string;

    @CreateDateColumn({type: 'date'})
    createdAt: Date;

    @UpdateDateColumn({type: 'date'})
    updatedAt: Date;

    @ManyToMany(type => User)
    @JoinTable()
    users: User[];
}
