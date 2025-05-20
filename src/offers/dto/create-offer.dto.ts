import { IsBoolean, IsNumber, IsPositive, Min } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  @IsPositive()
  @Min(1)
  amount: number;

  @IsBoolean()
  hidden: boolean;

  @IsNumber()
  itemId: number;
}
