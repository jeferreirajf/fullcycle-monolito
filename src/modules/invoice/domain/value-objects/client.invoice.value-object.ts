import ValueObject from "../../../@shared/domain/value-object/value-object.interface";
import Address from "./address.client.invoice.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object";

export type ClientProps = {
    id?: string;
    name: string;
    document: string;
    address: Address;
}

export default class Client extends Id implements ValueObject{
    private _name : string;
    private _document : string;
    private _address : Address;

    constructor(clientProps : ClientProps){
        super(clientProps.id);
        this._name = clientProps.name;
        this._document = clientProps.document;
        this._address = clientProps.address;
    }

    get name() : string {
        return this._name;
    }

    get document() : string {
        return this._document;
    }

    get address() : Address {
        return this._address;
    }

}