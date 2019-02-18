import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity()
export class Kudos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  poolId: string;

  @Column('text')
  title: string;

  @Column('text')
  channel: string;

  @Column('text')
  timestamp: string;

  @CreateDateColumn({type: 'date'})
  createdAt: Date;

  @UpdateDateColumn({type: 'date'})
  updatedAt: Date;
}
