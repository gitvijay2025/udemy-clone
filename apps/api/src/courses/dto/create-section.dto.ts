import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateSectionDto {
  @IsString()
  @MinLength(3)
  title!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  position?: number;
}
