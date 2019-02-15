import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../kudos/model/user.entity';

@Entity()
export class UserPresentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('boolean')
  present: boolean;

  @CreateDateColumn({ type: 'date' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'date' })
  updatedAt: Date;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
