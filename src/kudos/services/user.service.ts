import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { get } from 'lodash';
import { FindManyOptions, In, Repository } from 'typeorm';
import { UserPresentEntity } from '../../availability/model/user-present.entity';
import { AvatarDto } from '../dto/avatar.dto';
import { User } from '../model/user.entity';

@Injectable()
export class UserService {

  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
              @InjectRepository(UserPresentEntity) private readonly userPresentRepository: Repository<UserPresentEntity>) {
  }

  async findAllByTrelloName(trelloNameIds: string[]) {
    return await this.userRepository.find({
      where: {
        trelloName: In(trelloNameIds),
      },
    });
  }

  async findAllByTrelloId(trelloIds: string[]) {
    return await this.userRepository.find({
      where: {
        trelloId: In(trelloIds),
      },
    });
  }

  async saveUsers(users: User[]) {
    return await this.userRepository.save(users);
  }

  async findAll(options?: FindManyOptions) {
    return await this.userRepository.find(options);
  }

  async findUserBySlackId(slackId: string) {
    return await this.userRepository.findOne({ slackId: slackId });
  }

  async findByName(name: string) {
    return await this.userRepository.findOne({ name: name.charAt(0) === '@' ? name.substring(1) : name });
  }

  async findByUsersName(users: string[]) {
    if (users.length == 0) return [];
    return await this.userRepository.find({
      where: {
        name: In(this.removeUnnecessaryAt(users)),
      },
    });
  }

  mapAvatarToAvatarDto(forUser: string, users: User[]): AvatarDto {
    const user: User = users.find(u => u.name == forUser);
    return {
      image_24: user.image_24,
      image_32: user.image_32,
      image_48: user.image_48,
      image_72: user.image_72,
      image_192: user.image_192,
    } as AvatarDto;
  }

  mapAvatar(user: User): AvatarDto {
    return {
      image_24: user.image_24,
      image_32: user.image_32,
      image_48: user.image_48,
      image_72: user.image_72,
      image_192: user.image_192,
    } as AvatarDto;
  }

  removeUnnecessaryAt(usersNames: string[]) {
    return usersNames.map(el => {
      return el.charAt(0) === `@` ? el.substring(1) : el;
    });
  }

  async available(user: User) {
    const k = await this.userPresentRepository.create({
      present: true,
      user: user,
    });
    await this.userPresentRepository.save(k);
  }

  async unavailable(user: User) {
    const k = await this.userPresentRepository.create({
      present: false,
      user: user,
    });
    await this.userPresentRepository.save(k);
  }

  async determineAvailability(user: User): Promise<boolean> {
    const userAvail = await this.userPresentRepository.find(
      {
        where: { user },
        order: {
          createdAt: 'DESC',
        },
        take: 1,
      });
    return get(userAvail, '[0].present', false);
  }
}
