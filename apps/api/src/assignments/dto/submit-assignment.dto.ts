import { IsOptional, IsString, MinLength } from 'class-validator';

export class SubmitAssignmentDto {
  @IsString()
  @MinLength(10)
  content!: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;
}
