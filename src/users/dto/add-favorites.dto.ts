import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class AddToFavDto {
  @ApiProperty({ example: "recipe", description: "Рецепт" })
  readonly recipe: any;

  @ApiProperty({ example: "1", description: "id пользователя" })
  @IsString({ message: "Должно быть строкой" })
  readonly _id: string;
}
