import { IsArray, IsEnum, IsInt, IsOptional, IsString, Min, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CreateQuizOptionDto {
  @IsString()
  @MinLength(1)
  text!: string;

  isCorrect?: boolean;
}

class CreateQuizQuestionDto {
  @IsString()
  @MinLength(3)
  question!: string;

  @IsOptional()
  @IsString()
  type?: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';

  @IsOptional()
  @IsInt()
  @Min(1)
  points?: number;

  @IsInt()
  @Min(1)
  position!: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuizOptionDto)
  options?: CreateQuizOptionDto[];
}

export class CreateQuizDto {
  @IsString()
  @MinLength(3)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  passingScore?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuizQuestionDto)
  questions!: CreateQuizQuestionDto[];
}
