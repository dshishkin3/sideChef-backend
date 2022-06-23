import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Model } from "mongoose";
import * as bcrypt from "bcryptjs";
import { InjectModel } from "@nestjs/mongoose";

import { CreateUserDto } from "./dto/create-user.dto";
import { User, UserDocument } from "./schemas/schema.user";

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async login(dto: CreateUserDto) {
    const user = await this.validateUser(dto);
    return user;
  }

  async registration(dto: CreateUserDto) {
    console.log(dto);

    const existUser = await this.userModel.find({ email: dto.email });

    if (existUser.length > 0) {
      throw new UnauthorizedException({
        message: ["User with this e-mail already exists"],
      });
    }

    const hashPassword = await bcrypt.hash(dto.password, 5);
    const user = await this.userModel.create({
      ...dto,
      password: hashPassword,
    });

    return user;
  }

  private async validateUser(dto: CreateUserDto) {
    const user = await this.userModel.find({ email: dto.email });

    if (!user[0]) {
      throw new UnauthorizedException({
        message: ["User with this e-mail does not exist"],
      });
    }

    const passwordEquals = await bcrypt.compare(dto.password, user[0].password);
    if (user[0] && passwordEquals) {
      return user[0];
    }

    throw new UnauthorizedException({
      message: ["Incorrect e-mail or password"],
    });
  }
}
