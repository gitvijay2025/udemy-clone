import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export class CreateTicketDto {
  @IsString()
  @MinLength(5)
  subject!: string;

  @IsString()
  @MinLength(10)
  message!: string;

  @IsOptional()
  @IsEnum(TicketPriority, { message: 'priority must be one of: LOW, MEDIUM, HIGH, URGENT' })
  priority?: string;
}
