import { IsInt, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';

export class GradeAssignmentDto {
  @IsInt()
  @Min(0)
  @Max(100)
  score!: number;

  @IsOptional()
  @IsString()
  @MinLength(5)
  feedback?: string;
}
