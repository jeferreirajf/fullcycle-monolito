import Invoice from "./invoice.entity";
import Address from "./value-objects/address.client.invoice.value-object";
import Client from "./value-objects/client.invoice.value-object";
import InvoiceItem from "./value-objects/item.invoice.value-object";

describe("Invoice entity unit test", ()=>{
    it("should generate an invoice and calculate total", ()=>{
        const address = new Address({
            city: "city 1",
            complement: "complement 1",
            number: "number 1",
            state: "state 1",
            street: "street 1",
            zipcode: "zipcode 1"
        });

        const client = new Client({name: "Client 1", document: "document 1", address: address});

        const item1 = new InvoiceItem({name: "Item 1", price: 100});
        const item2 = new InvoiceItem({name: "Item 2", price: 250});

        const invoice = new Invoice({client: client, items: [item1, item2]});

        expect(invoice.id).toBeDefined();
        expect(invoice.total).toBe(350);
        expect(invoice.client.id).toBeDefined();
        expect(invoice.client.name).toBe("Client 1");
        expect(invoice.client.document).toBe("document 1");
        expect(invoice.client.address.city).toBe("city 1");
        expect(invoice.client.address.complement).toBe("complement 1");
        expect(invoice.client.address.number).toBe("number 1");
        expect(invoice.client.address.state).toBe("state 1");
        expect(invoice.client.address.street).toBe("street 1");
        expect(invoice.client.address.zipcode).toBe("zipcode 1");
        expect(invoice.items.length).toBe(2);
        expect(invoice.items[0].id).toBeDefined();
        expect(invoice.items[0].name).toBe("Item 1");
        expect(invoice.items[0].price).toBe(100);
        expect(invoice.items[1].id).toBeDefined();
        expect(invoice.items[1].name).toBe("Item 2");
        expect(invoice.items[1].price).toBe(250);
    });

    it("should return an error when invoice's item list is empty", ()=>{
        const address = new Address({
            city: "city 1",
            complement: "complement 1",
            number: "number 1",
            state: "state 1",
            street: "street 1",
            zipcode: "zipcode 1"
        });

        const client = new Client({name: "Client 1", document: "document 1", address: address});

        expect(()=>new Invoice({client: client, items: []})).toThrow("Expected at least one item to invoice");
    });
})