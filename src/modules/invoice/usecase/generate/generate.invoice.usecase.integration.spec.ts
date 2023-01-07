import { Sequelize } from "sequelize-typescript"
import { InvoiceModel } from "../../repository/invoice.model";
import InvoiceRepository from "../../repository/invoice.repository";
import AddressModel from "../../repository/value-object/address.model";
import ClientModel from "../../repository/value-object/client.model";
import InvoiceItemModel from "../../repository/value-object/invoice-item.model";
import GenerateInvoiceUseCase from "./generate.invoice.usecase";
import { GenerateInvoiceUseCaseInputDto } from "./generate.invoice.usecase.dto";

describe("Generate invoice use case integration test", ()=>{
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

    it("should generate an invoice", async () =>{
        const input: GenerateInvoiceUseCaseInputDto = {
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

        const invoiceRepository = new InvoiceRepository();
        const generateInvoiceUseCase = new GenerateInvoiceUseCase(invoiceRepository);

        const result = await generateInvoiceUseCase.execute(input);

        const invoiceModel = await InvoiceModel.findAll({include: [
            { model: InvoiceItemModel },
            { model: ClientModel, include: ["address"]}
        ]});

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