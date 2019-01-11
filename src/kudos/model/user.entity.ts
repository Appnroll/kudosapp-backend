import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    slackId: string;

    @Column()
    image_24: string

    @Column()
    image_32: string

    @Column()
    image_48: string

    @Column()
    image_72: string

    @Column()
    image_192: string

    @CreateDateColumn({type: 'date'})
    createdAt: Date;

    @UpdateDateColumn({type: 'date'})
    updatedAt: Date;
}
