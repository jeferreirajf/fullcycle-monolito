import Invoice from "../../domain/invoice.entity";
import Address from "../../domain/value-objects/address.client.invoice.value-object";
import Client from "../../domain/value-objects/client.invoice.value-object";
import InvoiceItem from "../../domain/value-objects/item.invoice.value-object";
import { FindInvoiceUseCaseInputDTO } from "../find/find.invoice.usecase.dto";
import GenerateInvoiceUseCase from "./generate.invoice.usecase";
import { GenerateInvoiceUseCaseInputDto } from "./generate.invoice.usecase.dto";

describe("Generate invoice use case unit test", ()=>{

    const address = new Address({
        city: "city 1", 
        street: "street 1", 
        complement: "complement 1", 
        zipcode: "zipcode 1", 
        number: "number 1", 
        state: "state 1"});

    const client = new Client({address: address, document: "document 1", name: "client 1"});

    const item1 = new InvoiceItem({name: "Item 1", price: 10});
    const item2 = new InvoiceItem({name: "Item 2", price: 25});

    const invoice = new Invoice({client: client, items: [item1, item2]});
    
    it("should generate an invoice", async ()=>{
        const MockRepository = ()=>{
            return {
                find: jest.fn(),
                save: jest.fn().mockReturnValue(Promise.resolve(invoice))
            }
        }

        const invoiceRepository = MockRepository();
        const invoiceGenerateUseCase = new GenerateInvoiceUseCase(invoiceRepository);

        const input: GenerateInvoiceUseCaseInputDto = {
            name: "Client 1",
            document: "Document 1",
            street: "Streeet 1",
            number: "Number 1",
            complement: "Complement 1",
            city: "City 1",
            state: "State 1",
            zipCode: "Zipcode 1",
            items: [
                {id: "id1", name: "item 1", price: 10},
                {id: "id2", name: "item 2", price: 25}
            ]
        };
        
        const result = await invoiceGenerateUseCase.execute(input);

        expect(result.id).toBeDefined();
        expect(result.total).toBe(35);
        expect(result.name).toBe(input.name);
        expect(result.document).toBe(input.document);
        expect(input.street).toBe(result.street);
        expect(input.complement).toBe(result.complement);
        expect(input.city).toBe(result.city);
        expect(input.zipCode).toBe(result.zipCode);
        expect(input.state).toBe(result.state);
        expect(input.items.length).toBe(2);
        expect(input.items[0].id).toBe(result.items[0].id);
        expect(input.items[0].name).toBe(result.items[0].name);
        expect(input.items[0].price).toBe(result.items[0].price);
	    expect(input.items[1].id).toBe(result.items[1].id);
        expect(input.items[1].name).toBe(result.items[1].name);
        expect(input.items[1].price).toBe(result.items[1].price);
    });
});