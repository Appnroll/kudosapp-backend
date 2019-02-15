import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {UserTokenService} from "../kudos/services/user-token.service";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private userToken: UserTokenService) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const body = request.headers;
    const auth = body.authorization
    if (!auth) {
      return false;
    }

    const token = auth.split(' ')[1];
    const userToken = await this.userToken.findUserByToken(token)

    if (!userToken) {
      return false
    }

    request.userToken = userToken;
    return true;

  }
}