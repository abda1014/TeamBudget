
import {User} from "./user.entity";
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class gruppe {
    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get users(): User[] {
        return this._users;
    }

    set users(value: User[]) {
        this._users = value;
    }
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    id : string
    private _name : string;
    datum: Date;
    private _users : User[];

    constructor(name:string,users:User[], password:string){
        this._name =name;
        this._users=users;
    }
}