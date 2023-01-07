import Id from "../../../@shared/domain/value-object/id.value-object";
import ValueObject from "../../../@shared/domain/value-object/value-object.interface";

export type InvoiceItemProps={
    id?: string,
    name: string,
    price: number
}

export default class InvoiceItem extends Id implements ValueObject{
    private _name: string;
    private _price: number;

    constructor(invoiceItemProps: InvoiceItemProps) {
        super(invoiceItemProps.id);
        this._name = invoiceItemProps.name;
        this._price = invoiceItemProps.price;
    }

    get name() : string{
        return this._name;
    }

    get price() : number{
        return this._price;
    }
}