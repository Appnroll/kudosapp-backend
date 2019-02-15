import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { UserDto } from '../../kudos/dto/user.dto';
import { SlackService } from '../../kudos/services/slack.service';
import { UserService } from '../../kudos/services/user.service';

@Controller('availability')
@ApiUseTags('availability')
export class AvailabilityController {
  constructor(private userService: UserService,
              private slackService: SlackService) {
  }

  @Get()
  // @UseGuards(AuthGuard)
  @ApiResponse({ status: 200, description: 'Get all people availability', type: UserDto, isArray: true })
  async getPeople(): Promise<UserDto[]> {
    return (await this.userService.findAll()).map(u => ({
      name: u.name,
      avatar: this.userService.mapAvatar(u),
    }));
  }
}
