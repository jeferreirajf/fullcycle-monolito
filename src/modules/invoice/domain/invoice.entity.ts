import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity"
import Id from "../../@shared/domain/value-object/id.value-object";
import Client, { ClientProps } from "./value-objects/client.invoice.value-object";
import InvoiceItem, { InvoiceItemProps } from "./value-objects/item.invoice.value-object";

export type InvoiceProps = {
    id?: string,
    client: ClientProps,
    items: InvoiceItemProps[],
    total?: number
    createdAt?: Date,
    updatedAt?: Date
}

export default class Invoice extends BaseEntity implements AggregateRoot{

    private _client: Client;
    private _items : InvoiceItem[];
    private _total: number;

    constructor(invoiceProps: InvoiceProps){
        super(new Id(invoiceProps.id), invoiceProps.createdAt, invoiceProps.updatedAt);

        if(invoiceProps.items.length <= 0){
            throw new Error("Expected at least one item to invoice");
        }

        this._client = new Client(invoiceProps.client);
        this._items = invoiceProps.items.map(i => new InvoiceItem(i));
        this._total = this.calculateTotal();
    }

    get client() : Client{
        return this._client
    }

    get items(): InvoiceItem[]{
        return this._items;
    }

    get total(): number{
        return this._total;
    }

    calculateTotal(): number{
        const total = this.items.reduce((acc, curr) => acc + curr.price, 0);
        this._total = total;
        return this._total;
    }
}