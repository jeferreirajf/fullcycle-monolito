import { Sequelize } from "sequelize-typescript";
import Invoice from "../../domain/invoice.entity";
import Address from "../../domain/value-objects/address.client.invoice.value-object";
import Client from "../../domain/value-objects/client.invoice.value-object";
import InvoiceItem from "../../domain/value-objects/item.invoice.value-object";
import { InvoiceModel } from "../../repository/invoice.model";
import InvoiceRepository from "../../repository/invoice.repository";
import AddressModel from "../../repository/value-object/address.model";
import ClientModel from "../../repository/value-object/client.model";
import InvoiceItemModel from "../../repository/value-object/invoice-item.model";
import FindInvoiceUseCase from "./find.invoice.usecase";
import {FindInvoiceUseCaseInputDTO} from "./find.invoice.usecase.dto";


describe("Find invoice usecase integration test", ()=>{

    let sequelize : Sequelize;

    beforeEach(async ()=>{
        sequelize = new Sequelize({
            dialect: "sqlite",
            logging: false,
            storage: ":memory:",
            sync: {force: true}
        });

        sequelize.addModels([InvoiceItemModel, AddressModel, ClientModel, InvoiceModel]);
        await sequelize.sync();
    });

    afterEach(async ()=>{
        await sequelize.close();
    });

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

    it("should find an invoice", async ()=>{
        const invoiceRepository = new InvoiceRepository();
        const invoiceFindUseCase = new FindInvoiceUseCase(invoiceRepository);

        await insertDataIntoDb();

        const input: FindInvoiceUseCaseInputDTO = {
            id: invoice.id.id
        };

        const result = await invoiceFindUseCase.execute(input);

        expect(result.id).toBe(invoice.id.id);
        expect(result.name).toBe(invoice.client.name);
        expect(result.document).toBe(invoice.client.document);
        expect(result.address.street).toBe(invoice.client.address.street);
        expect(result.address.number).toBe(invoice.client.address.number);
        expect(result.address.complement).toBe(invoice.client.address.complement);
        expect(result.address.city).toBe(invoice.client.address.city);
        expect(result.address.state).toBe(invoice.client.address.state);
        expect(result.address.zipCode).toBe(invoice.client.address.zipcode);
        expect(result.items[0].id).toBe(invoice.items[0].id);
        expect(result.items[0].name).toBe(invoice.items[0].name);
        expect(result.items[0].price).toBe(invoice.items[0].price);
        expect(result.items[1].id).toBe(invoice.items[1].id);
        expect(result.items[1].name).toBe(invoice.items[1].name);
        expect(result.items[1].price).toBe(invoice.items[1].price);
        expect(result.total).toBe(invoice.total);
        expect(result.createdAt).toBeDefined();
    });
})