import { Model, Sequelize } from "sequelize-typescript";
import Invoice from "../domain/invoice.entity";
import Address from "../domain/value-objects/address.client.invoice.value-object";
import Client from "../domain/value-objects/client.invoice.value-object";
import InvoiceItem from "../domain/value-objects/item.invoice.value-object";
import { InvoiceModel } from "./invoice.model";
import InvoiceRepository from "./invoice.repository";
import AddressModel from "./value-object/address.model";
import ClientModel from "./value-object/client.model";
import InvoiceItemModel from "./value-object/invoice-item.model";

describe("Invoice repository unit test", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true }
        });

        sequelize.addModels([AddressModel, ClientModel, InvoiceItemModel, InvoiceModel]);
        await sequelize.sync();
    })

    afterEach(async () => {
        sequelize.close();
    })

    const item1 = new InvoiceItem({ id: "id1", name: "Item 1", price: 10 });
    const item2 = new InvoiceItem({ id: "id2", name: "Item 2", price: 25 });

    const address = new Address({
        id: "address 1",
        street: "Street 1",
        number: "Number 1",
        complement: "Complement 1",
        city: "City 1",
        state: "State 1",
        zipcode: "zip code 1"
    });

    const client = new Client({
        id: "idc1",
        name: "Client 1",
        document: "Document 1",
        address: address
    });

    const invoice = new Invoice({
        id: "idi1",
        client: client,
        items: [item1, item2]
    });

    async function insertDataIntoDb() {
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
            items: [{
                id: invoice.items[0].id,
                name: invoice.items[0].name,
                price: invoice.items[0].price
            },
            {
                id: invoice.items[1].id,
                name: invoice.items[1].name,
                price: invoice.items[1].price
            }]
        },
            {
                include: [
                    {
                        model: ClientModel,
                        include: [{ model: AddressModel }]
                    },
                    {
                        model: InvoiceItemModel
                    }]
            });
    }

    it("should find an invoice", async () => {
        await insertDataIntoDb();

        const invoiceRepository = new InvoiceRepository();

        const result = await invoiceRepository.find(invoice.id.id);

        expect(result).toStrictEqual(invoice);
    });

    it("should thrown an error when not find an invoice", async () => {
        await insertDataIntoDb();

        const invoiceRepository = new InvoiceRepository();

        await expect(async () => await invoiceRepository.find("1234")).rejects.toThrowError("Invoice 1234 not found");
    });

    it("should generate an invoice", async () => {
        const invoiceRepository = new InvoiceRepository();

        await invoiceRepository.save(invoice);

        const result = await InvoiceModel.findAll(
            {
                include: [
                    {model: InvoiceItemModel}, 
                    {model: ClientModel, include: [AddressModel]}
                ]
            });

        expect(result.length).toBe(1);

        expect(result[0].id).toBe(invoice.id.id);
        expect(result[0].total).toBe(invoice.total);
        expect(result[0].client.id).toBe(invoice.client.id);
        expect(result[0].client.name).toBe(invoice.client.name);
        expect(result[0].client.document).toBe(invoice.client.document);
        expect(result[0].client.address.id).toBe(invoice.client.address.id);
        expect(result[0].client.address.street).toBe(invoice.client.address.street);
        expect(result[0].client.address.number).toBe(invoice.client.address.number);
        expect(result[0].client.address.complement).toBe(invoice.client.address.complement);
        expect(result[0].client.address.city).toBe(invoice.client.address.city);
        expect(result[0].client.address.state).toBe(invoice.client.address.state);
        expect(result[0].client.address.zipcode).toBe(invoice.client.address.zipcode);
        expect(result[0].items.length).toBe(2);
        expect(result[0].items[0].id).toBe(invoice.items[0].id);
        expect(result[0].items[0].name).toBe(invoice.items[0].name);
        expect(result[0].items[0].price).toBe(invoice.items[0].price);
        expect(result[0].items[1].id).toBe(invoice.items[1].id);
        expect(result[0].items[1].name).toBe(invoice.items[1].name);
        expect(result[0].items[1].price).toBe(invoice.items[1].price);
    });

});