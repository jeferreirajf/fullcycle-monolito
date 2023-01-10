import request from "supertest";
import { Sequelize } from "sequelize-typescript";
import { app, sequelize } from "../../express";

describe("Client route e2e test", () => {

    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should add a client", async () => {
        const req = await request(app)
            .post("/clients")
            .send({
                name: "Client 1",
                address: "Address 1",
                email: "Email@email.com",
            });

        expect(req.status).toBe(200);
    });
})