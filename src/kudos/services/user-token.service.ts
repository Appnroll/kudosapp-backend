import {BadRequestException, Injectable} from '@nestjs/common';
import {Repository} from "typeorm";
import {InjectRepository} from '@nestjs/typeorm';
import {SlackToken} from "../model/slack-token.entity";
import {UserService} from "./user.service";

@Injectable()
export class UserTokenService {

  constructor(@InjectRepository(SlackToken) private readonly slackTokenRepository: Repository<SlackToken>,
              private userService: UserService) {
  }

  async findUserByToken(token: string) {
    return await this.slackTokenRepository.findOne({
      where: {
        token
      }
    })
  }

  async saveOrUpdate(token: string, slackId: string) {
    const user = await this.userService.findUserBySlackId(slackId)
    if (!user) {
      throw new BadRequestException();
    }
    const userToken = await this.slackTokenRepository.findOne({
      where: {user}
    })

    if (!userToken) {
      const userTokenEntity = this.slackTokenRepository.create({
        token,
        user
      })
      await this.slackTokenRepository.save(userTokenEntity)
    } else {
      userToken.token = token;
      await this.slackTokenRepository.save(userToken)
    }
  }
}
