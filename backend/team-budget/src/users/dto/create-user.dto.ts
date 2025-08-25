import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
	@IsNotEmpty()
	@IsString()
	@Length(1, 100)
	vorname: string;

	@IsNotEmpty()
	@IsString()
	@Length(1, 100)
	nachname: string;

	@IsNotEmpty()
	@IsString()
	@Length(3, 100)
	username: string;

	@IsNotEmpty()
	@IsEmail()
	@Length(3, 100)
	email: string;

	@IsNotEmpty()
	@IsString()
	@Length(8, 128)
	password: string;
}
