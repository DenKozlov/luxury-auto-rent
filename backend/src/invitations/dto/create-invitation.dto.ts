import { IsEmail, IsOptional, IsIn } from 'class-validator';

export class CreateInvitationDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsIn(['user', 'admin'])
  role: string;
}
