import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateAssignmentDto {
  @IsString()
  @MinLength(3)
  title!: string;

  @IsString()
  @MinLength(10)
  description!: string;

  @IsOptional()
  @IsString()
  dueDate?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxScore?: number;
}
