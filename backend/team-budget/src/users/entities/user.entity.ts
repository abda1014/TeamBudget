import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class User {
  get id(): string {
    return this._id;
  }
  set passwordHash(value: string) {
    this._passwordHash = value;
  }
  get vorname(): string {
    return this._vorname;
  }

  set vorname(value: string) {
    this._vorname = value;
  }

  get nachname(): string {
    return this._nachname;
  }

  set nachname(value: string) {
    this._nachname = value;
  }

  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  private _id: string;
  private _vorname: string;
  private _nachname: string;
  private _username: string;
  private _email: string;
  @Exclude() private _passwordHash: string;

  constructor(
    vorname: string,
    nachname: string,
    username: string,
    email: string,
    passwordHash: string,
  ) {
    this._vorname = vorname;
    this._nachname = nachname;
    this._username = username;
    this._email = email;
    this._passwordHash = passwordHash;
  }
}
