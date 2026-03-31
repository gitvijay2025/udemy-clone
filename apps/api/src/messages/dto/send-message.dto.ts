import { IsOptional, IsString, MinLength } from 'class-validator';

export class ComposeMessageDto {
  @IsString()
  receiverId!: string;

  @IsString()
  @MinLength(1)
  subject!: string;

  @IsString()
  @MinLength(1)
  content!: string;
}

export class ReplyMessageDto {
  @IsString()
  @MinLength(1)
  content!: string;
}
