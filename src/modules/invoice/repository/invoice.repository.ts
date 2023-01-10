import Invoice from "../domain/invoice.entity";
import Address from "../domain/value-objects/address.client.invoice.value-object";
import Client from "../domain/value-objects/client.invoice.value-object";
import InvoiceItem from "../domain/value-objects/item.invoice.value-object";
import InvoiceGateway from "../gateway/invoice.gateway.interface";
import { InvoiceModel } from "./invoice.model";
import { InvoiceClientAddressModel } from "./value-object/address.model";
import { InvoiceClientModel } from "./value-object/client.model";
import { InvoiceItemModel } from "./value-object/invoice-item.model";


export default class InvoiceRepository implements InvoiceGateway {
    async save(invoice: Invoice): Promise<void> {
        try {
            await InvoiceModel.create({
                id: invoice.id.id,
                total: invoice.total,
                createdAt: invoice.createdAt,
                updatedAt: invoice.updatedAt,
                client: {
                    id: invoice.client.id,
                    name: invoice.client.name,
                    document: invoice.client.document,
                    address: {
                        id: invoice.client.address.id,
                        street: invoice.client.address.street,
                        number: invoice.client.address.number,
                        complement: invoice.client.address.complement,
                        city: invoice.client.address.city,
                        state: invoice.client.address.state,
                        zipcode: invoice.client.address.zipcode
                    }
                },
                items: invoice.items.map((item) => {
                    return {
                        id: item.id,
                        name: item.name,
                        price: item.price
                    }
                }),
            },
                {
                    include: [
                        { model: InvoiceClientModel, include: [{ model: InvoiceClientAddressModel }] },
                        { model: InvoiceItemModel }
                    ]
                });
        }
        catch (error) {
            console.log(error);
            throw new Error("Error trying to generate an invoice");
        }
    }

    async find(id: string): Promise<Invoice> {
        const result = await InvoiceModel.findOne({
            where: { id },
            include: [
                { model: InvoiceItemModel },
                { model: InvoiceClientModel, include: ["address"] }
            ]
        });

        if (result === null) {
            throw new Error(`Invoice ${id} not found`);
        }

        const address = new Address({
            id: result.client.address.id,
            city: result.client.address.city,
            complement: result.client.address.complement,
            number: result.client.address.number,
            state: result.client.address.state,
            street: result.client.address.street,
            zipcode: result.client.address.zipcode
        });

        const client = new Client({
            id: result.client.id,
            name: result.client.name,
            document: result.client.document,
            address: address
        });

        const items = result.items.map((item) => {
            return new InvoiceItem({
                id: item.id,
                name: item.name,
                price: item.price
            });
        });

        const invoice = new Invoice({
            id: result.id,
            client: client,
            items: items,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt
        });

        return invoice;
    }

}
