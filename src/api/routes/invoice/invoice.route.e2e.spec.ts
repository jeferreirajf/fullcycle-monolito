import { InvoiceModel } from "../../../modules/invoice/repository/invoice.model";
import { app, sequelize } from "../../express";
import request from "supertest";
import { InvoiceItemModel } from "../../../modules/invoice/repository/value-object/invoice-item.model";
import { InvoiceClientModel } from "../../../modules/invoice/repository/value-object/client.model";
import { InvoiceClientAddressModel } from "../../../modules/invoice/repository/value-object/address.model";

describe("Invoice router e2e test", ()=>{
    beforeEach(async () => await sequelize.sync({force: true}));
    afterAll(async () => await sequelize.close());

    let invoiceModel: InvoiceModel;

    async function setup(){
        invoiceModel = await InvoiceModel.create({
            id: "idi1",
            client: {
                id: "idc1",
                name: "Client 1",
                document: "Document 1",
                address: {
                    id: "Address 1",
                    street: "Street 1",
                    number: "Number 1",
                    complement: "Complement 1",
                    city: "City 1",
                    state: "State 1",
                    zipcode: "Zipcode 1"
                }                             
            },
            items: [{
                id: "idi1",
                name: "Item 1",
                price: 100
            },
            {
                id: "idi2",
                name: "Item 2",
                price: 250
            }], 
            total: 350,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {include: [
            {
                model: InvoiceClientModel,
                include: [{ model: InvoiceClientAddressModel }]
            },
            {
                model: InvoiceItemModel
            }]});
    }

    it("should create an invoice", async () =>{
        await setup();

        const result = await request(app)
            .get(`/invoice/${invoiceModel.id}`)
            .send();
    });
});