import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class DeleteFromFavDto {
  @ApiProperty({ example: "1", description: "id рецепта" })
  @IsNumber({}, { message: "Должно быть числом" })
  readonly idProduct: number;

  @ApiProperty({ example: "1", description: "id пользователя" })
  @IsString({ message: "Должно быть строкой" })
  readonly _id: string;
}
