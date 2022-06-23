import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcryptjs";

import { User, UserDocument } from "src/auth/schemas/schema.user";
import { ChangeUserDto } from "src/users/dto/change-user.dto";
import { AddToFavDto } from "./dto/add-favorites.dto";
import { DeleteFromFavDto } from "./dto/delete-favorites.dto";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async change(dto: ChangeUserDto) {
    let user = Object.assign(dto);

    if (dto.password) {
      user.password = await bcrypt.hash(dto.password, 5);
    }

    await this.userModel.findByIdAndUpdate(dto._id, {
      $set: user,
    });

    return { message: ["User data updated"] };
  }

  async checkUser(_id: string) {
    const user = await this.userModel.findById(_id);

    if (!user) {
      throw new UnauthorizedException({
        message: ["User is not found"],
      });
    }

    return user;
  }

  async deleteUser(_id: string) {
    await this.userModel.findByIdAndDelete(_id);

    return { message: ["User deleted"] };
  }

  async addToFavorites(dto: AddToFavDto) {
    const user = await this.userModel.findById(dto._id);

    const existRecipe = user.favorites.find(
      (recipe) => recipe.id === dto.recipe.id
    );

    if (existRecipe) {
      throw new UnauthorizedException({
        message: ["This recipe has already been added to the cart"],
      });
    }

    await user.updateOne({
      $push: {
        favorites: dto.recipe,
      },
    });

    return { message: ["Recipe added to favorites"] };
  }

  async deleteFromFavorites(dto: DeleteFromFavDto) {
    const user = await this.userModel.findById(dto._id);

    const filteredFavorites = user.favorites.filter(
      (recipe) => recipe.id !== dto.idProduct
    );

    await user.updateOne({
      favorites: filteredFavorites,
    });

    return { message: ["Recipe removed from favorites"] };
  }
}
