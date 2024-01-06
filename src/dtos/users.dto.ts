import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, IsDateString, IsOptional, ValidateIf } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  public username: string;

  @IsString()
  @IsNotEmpty()
  public firstName: string;

  @IsString()
  @IsNotEmpty()
  public lastName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1)
  public gender: string;

  @IsDateString()
  @IsNotEmpty()
  public dateOfBirth: Date;

  @IsString()
  @IsOptional()
  public profilePic?: string;

  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  public password: string;
}

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  public email?: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  public password: string;
}
