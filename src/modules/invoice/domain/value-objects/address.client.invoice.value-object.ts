import Id from "../../../@shared/domain/value-object/id.value-object";
import ValueObject from "../../../@shared/domain/value-object/value-object.interface";

export type AddressProps = {
    id?: string,
    street: string,
    number: string,
    complement: string,
    city: string,
    state: string,
    zipcode: string
}

export default class Address extends Id implements ValueObject {
    private _street: string;
    private _number: string;
    private _complement: string;
    private _city: string;
    private _state: string;
    private _zipcode: string;

    constructor(addressProps: AddressProps) {
        super(addressProps.id);
        this._street = addressProps.street;
        this._number = addressProps.number;
        this._complement = addressProps.complement;
        this._city = addressProps.city;
        this._state = addressProps.state;
        this._zipcode = addressProps.zipcode;
    }

    get street(): string {
        return this._street;
    }

    get number(): string {
        return this._number;
    }

    get complement(): string {
        return this._complement;
    }

    get city(): string {
        return this._city;
    }

    get state(): string {
        return this._state;
    }

    get zipcode(): string {
        return this._zipcode;
    }
}