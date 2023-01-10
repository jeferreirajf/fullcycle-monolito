import { app, sequelize } from "../../express";
import request from "supertest";

describe("Product route e2e test", ()=>{
    beforeEach(async ()=>{
        await sequelize.sync({force: true});
    });

    afterAll(async ()=>{
        await sequelize.close();
    });

    it("should add a product", async ()=>{
        const response = await request(app)
            .post("/products")
            .send({
                "name": "Product 1",
                "description": "Description 1",
                "purchasePrice": 100,
                "stock": 10,
            });

        expect(response.status).toEqual(200);
    });
});