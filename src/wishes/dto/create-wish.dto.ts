import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateWishDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @IsString()
  @IsNotEmpty()
  link: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsNumber()
  @Min(1)
  price: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(1024)
  description: string;
}
