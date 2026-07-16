import { IsString } from 'class-validator';

export class AcceptInvitationDto {
  @IsString()
  token: string;

  @IsString()
  name: string;

  @IsString()
  password: string;
}
