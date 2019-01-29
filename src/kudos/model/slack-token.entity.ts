import {Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {User} from "./user.entity";

@Entity()
export class SlackToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  token: string;

  @OneToOne(type => User)
  user: User;

  @CreateDateColumn({type: 'date'})
  createdAt: Date;

  @UpdateDateColumn({type: 'date'})
  updatedAt: Date;

}
