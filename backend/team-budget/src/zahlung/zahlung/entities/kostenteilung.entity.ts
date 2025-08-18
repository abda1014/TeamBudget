import { User } from '../../../users/entities/user.entity';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class kostenteilung {
    get id(): string {
        return this._id;
    }

    get expenseId(): string {
        return this._expenseId;
    }
    get betrag(): bigint {
        return this._betrag;
    }

    set betrag(value: bigint) {
        this._betrag = value;
    }

    get schuldner(): User {
        return this._schuldner;
    }

    set schuldner(value: User) {
        this._schuldner = value;
    }

    get wert(): bigint[] {
        return this._wert;
    }

    set wert(value: bigint[]) {
        this._wert = value;
    }
    constructor(betrag: bigint, schuldner: User, wert: bigint[]) {
        this._betrag = betrag;
        this._schuldner = schuldner;
        this._wert = wert;
    }
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    private _id: string;

    @IsNotEmpty()
    @IsString()
    @IsUUID()
    private _expenseId: string;

    private _betrag :bigint;

    private _schuldner: User;

    private _wert: bigint[];




}