import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Kudos {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    givenTo: string;

    @Column()
    from: string;

    @Column('text')
    description: string;

    @Column('datetime')
    createdAt: Date;

    @Column('datetime')
    updatedAt: Date;
}
