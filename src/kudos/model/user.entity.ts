import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserPresentEntity } from '../../availability/model/user-present.entity';
import { UserKudosEntity } from './user-kudos.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  slackId: string;

  @Column({
    default: '',
  })
  trelloName: string;

  @Column({
    default: '',
  })
  trelloId: string;

  @Column()
  image_24: string;

  @Column()
  image_32: string;

  @Column()
  image_48: string;

  @Column()
  image_72: string;

  @Column()
  image_192: string;

  @CreateDateColumn({ type: 'date' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'date' })
  updatedAt: Date;

  @OneToMany(type => UserKudosEntity, userKudos => userKudos.from)
  givenKudos: UserKudosEntity[];

  @OneToMany(type => UserKudosEntity, userKudos => userKudos.user)
  userKudos: UserKudosEntity[];

  @OneToMany(type => UserPresentEntity, userPresent => userPresent.user)
  userAvailability: UserPresentEntity;

}
