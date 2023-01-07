import Invoice from "../../domain/invoice.entity"
import Address from "../../domain/value-objects/address.client.invoice.value-object"
import Client from "../../domain/value-objects/client.invoice.value-object";
import InvoiceItem from "../../domain/value-objects/item.invoice.value-object";
import FindInvoiceUseCase from "./find.invoice.usecase";

describe("Find invoice use case unit test", ()=>{
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

    it("should find an invoice", async () =>{
        
        const MockRepository = ()=>{
            return {
                find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
                save: jest.fn()
            }
        }

        const invoiceRepository = MockRepository();
        const findInvoiceUseCase = new FindInvoiceUseCase(invoiceRepository);
        
        const findInvoiceInput = {
            id: invoice.id.id
        }

        const result = await findInvoiceUseCase.execute(findInvoiceInput);

        expect(result.id).toBe(invoice.id.id);
        expect(result.total).toBe(invoice.total);
        expect(result.address.street).toBe(invoice.client.address.street);
        expect(result.address.complement).toBe(invoice.client.address.complement);
        expect(result.address.zipCode).toBe(invoice.client.address.zipcode);
        expect(result.address.city).toBe(invoice.client.address.city);
        expect(result.address.state).toBe(invoice.client.address.state);
        expect(result.address.number).toBe(invoice.client.address.number);
        expect(result.name).toBe(invoice.client.name);
        expect(result.items.length).toBe(2);
        expect(result.items[0].id).toBe(item1.id);
        expect(result.items[0].name).toBe(item1.name);
        expect(result.items[0].price).toBe(item1.price);
        expect(result.items[1].id).toBe(item2.id);
        expect(result.items[1].name).toBe(item2.name);
        expect(result.items[1].price).toBe(item2.price);
        expect(result.createdAt).toBe(invoice.createdAt);
    });

    it("should thrown an error when invoice not found", async ()=>{
        const MockRepository = ()=>{
            return {
                find: jest.fn().mockReturnValue(null),
                save: jest.fn()
            }
        }

        const invoiceRepository = MockRepository();
        const findInvoiceUseCase = new FindInvoiceUseCase(invoiceRepository);
        
        const findInvoiceInput = {
            id: "asd"
        }

        await expect(findInvoiceUseCase.execute(findInvoiceInput)).rejects.toThrow("Invoice asd was not found");
    });
})