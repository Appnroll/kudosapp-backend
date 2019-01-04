import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

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

    @CreateDateColumn({type: 'date'})
    createdAt: Date;

    @UpdateDateColumn({type: 'date'})
    updatedAt: Date;
}
