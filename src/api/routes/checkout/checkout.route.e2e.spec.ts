import InvoiceFacadeFactory from "../../../modules/invoice/factory/invoice.facade.factory";
import { AdmProductModel } from "../../../modules/product-adm/repository/product.model";
import { app, sequelize } from "../../express";
import request from "supertest";
import { ClientModel } from "../../../modules/client-adm/repository/client.model";
import { CatalogProductModel } from "../../../modules/store-catalog/repository/product.model";

describe("Checkout route e2e test", () => {
    beforeEach(async () => await sequelize.sync({ force: true }));

    afterAll(async () => await sequelize.close());

    async function setup() {
        await AdmProductModel.create({
            id: "idp1",
            name: "Product 1",
            description: "description 1",
            purchasePrice: 5,
            stock: 5,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await AdmProductModel.create({
            id: "idp2",
            name: "Product 2",
            description: "description 2",
            purchasePrice: 10,
            stock: 5,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await CatalogProductModel.create({
            id: "idp1",
            name: "Product 1",
            description: "description 1",
            salesPrice: 100
        });

        await CatalogProductModel.create({
            id: "idp2",
            name: "Product 2",
            description: "description 2",
            salesPrice: 250
        });

        await ClientModel.create({
            id: "idc1",
            name: "Client 1",
            email: "email1@email.com",
            address: "Address 1",
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    it("should create an invoice", async () => {
        const invoiceFacade = InvoiceFacadeFactory.create();

        await setup();

        const orderData = {
            name: "Client 1",
            document: "Document 1",
            street: "Street 1",
            number: "Number 1",
            complement: "Complement 1",
            city: "City 1",
            state: "State 1",
            zipCode: "Zipcode 1",
            items: [{
                id: "idp1",
                name: "Product 1",
                price: 100
            },
            {
                id: "idp2",
                name: "Product 2",
                price: 250
            }]
        };

        await invoiceFacade.generate(orderData);

        const req = await request(app)
            .post("/checkout")
            .send({
                "clientId":"idc1",
                "products":[{"productId": "idp1"}, {"productId": "idp2"}]
            });

        expect(req.status).toBe(200);
        expect(req.body.id).toBeDefined();
        expect(req.body.total).toBe(350);
        expect(req.body.products[0].productId).toBe("idp1");
        expect(req.body.products[1].productId).toBe("idp2");
    });
});