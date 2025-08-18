import {UUID} from "crypto";
import {User} from "../../../users/entities/user.entity";
import {IsNotEmpty, IsString, IsUUID} from "class-validator";

export class Zahlung {
    get id(): string {
        return this._id;
    }
    get beschreibung(): string {
        return this._beschreibung;
    }

    set beschreibung(value: string) {
        this._beschreibung = value;
    }

    get betrag(): bigint {
        return this._betrag;
    }

    set betrag(value: bigint) {
        this._betrag = value;
    }

    get zahlender(): User {
        return this._zahlender;
    }

    set zahlender(value: User) {
        this._zahlender = value;
    }


    constructor(beschreibung :string,betrag:bigint, zahlender:User) {
        this.beschreibung = beschreibung;
        this.betrag = betrag;
        this.zahlender = zahlender;
    }
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    private _id: string;
    private _beschreibung:string;
    private _betrag: bigint;
    private _zahlender: User;
    datum: Date;




}
