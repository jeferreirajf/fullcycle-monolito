import { Sequelize } from "sequelize-typescript";
import Invoice from "../domain/invoice.entity";
import Address from "../domain/value-objects/address.client.invoice.value-object";
import Client from "../domain/value-objects/client.invoice.value-object";
import InvoiceItem from "../domain/value-objects/item.invoice.value-object";
import { InvoiceModel } from "../repository/invoice.model";
import InvoiceRepository from "../repository/invoice.repository";
import { InvoiceClientAddressModel } from "../repository/value-object/address.model";
import { InvoiceClientModel } from "../repository/value-object/client.model";
import { InvoiceItemModel } from "../repository/value-object/invoice-item.model";
import FindInvoiceUseCase from "../usecase/find/find.invoice.usecase";
import { FindInvoiceUseCaseInputDTO } from "../usecase/find/find.invoice.usecase.dto";
import GenerateInvoiceUseCase from "../usecase/generate/generate.invoice.usecase";
import InvoiceFacade from "./invoice.facade";
import { GenerateInvoiceFacadeInputDto } from "./invoice.facade.interface";

describe("Facade invoice integration test", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            logging: false,
            storage: ":memory:",
            sync: { force: true }
        });

        sequelize.addModels([InvoiceItemModel, InvoiceClientAddressModel, InvoiceClientModel, InvoiceModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
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
                        model: InvoiceClientModel,
                        include: [{ model: InvoiceClientAddressModel }]
                    },
                    {
                        model: InvoiceItemModel
                    }]
            });
    }

    const invoiceRepository = new InvoiceRepository();
    const invoiceFindUsecase = new FindInvoiceUseCase(invoiceRepository);
    const invoiceGenerateUseCase = new GenerateInvoiceUseCase(invoiceRepository);
    const invoiceFacade = new InvoiceFacade({ find: invoiceFindUsecase, generate: invoiceGenerateUseCase });

    it("should find an invoice", async () => {
        await insertDataIntoDb();

        const input: FindInvoiceUseCaseInputDTO = {
            id: invoice.id.id
        };

        const result = await invoiceFacade.find(input);

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

    it("should generate an invoice", async () => {
        const input: GenerateInvoiceFacadeInputDto
            = {
            name: "Client 1",
            document: "Document 1",
            street: "Street 1",
            number: "Number 1",
            complement: "Complement 1",
            city: "City 1",
            state: "State 1",
            zipCode: "Zipcode 1",
            items: [{
                id: "id1",
                name: "Item 1",
                price: 10
            },
            {
                id: "id2",
                name: "Item 2",
                price: 25
            }]
        };

        const result = await invoiceFacade.generate(input);

        const invoiceModel = await InvoiceModel.findAll({
            include: [
                { model: InvoiceItemModel },
                { model: InvoiceClientModel, include: ["address"] }
            ]
        });

        expect(invoiceModel.length).toBe(1);
        expect(invoiceModel[0].id).toBe(result.id);
        expect(invoiceModel[0].client.name).toBe(result.name);
        expect(invoiceModel[0].client.document).toBe(result.document);
        expect(invoiceModel[0].client.address.street).toBe(result.street);
        expect(invoiceModel[0].client.address.number).toBe(result.number);
        expect(invoiceModel[0].client.address.complement).toBe(result.complement);
        expect(invoiceModel[0].client.address.city).toBe(result.city);
        expect(invoiceModel[0].client.address.state).toBe(result.state);
        expect(invoiceModel[0].client.address.zipcode).toBe(result.zipCode);
        expect(invoiceModel[0].items[0].id).toBe(result.items[0].id);
        expect(invoiceModel[0].items[0].name).toBe(result.items[0].name);
        expect(invoiceModel[0].items[0].price).toBe(result.items[0].price);
        expect(invoiceModel[0].items[1].id).toBe(result.items[1].id);
        expect(invoiceModel[0].items[1].name).toBe(result.items[1].name);
        expect(invoiceModel[0].items[1].price).toBe(result.items[1].price);
        expect(invoiceModel[0].total).toBe(result.total);
    });
})