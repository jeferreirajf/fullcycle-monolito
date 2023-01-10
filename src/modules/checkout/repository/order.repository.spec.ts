import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import { CheckoutOrderModel } from "./order.model";
import { CheckoutRepository } from "./order.repository";
import { CheckoutClientModel } from "./value-objects/client.model";
import { CheckoutProductModel } from "./value-objects/product.model";

describe("Order repository unit test", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true }
        })

        sequelize.addModels([CheckoutProductModel, CheckoutClientModel, CheckoutOrderModel]);
        await sequelize.sync();
    });

    afterEach(async ()=>await sequelize.close());

    const client = new Client({
        id: new Id("idc1"),
        name: "Client 1",
        email: "email 1",
        address: "address 1"
    });

    const product1 = new Product({
        id: new Id("idp1"),
        name: "Product 1",
        description: "Description 1",
        salesPrice: 100
    });

    const product2 = new Product({
        id: new Id("idp2"),
        name: "Product 2",
        description: "Description 2",
        salesPrice: 200
    });

    const order = new Order({
        client: client,
        products: [product1, product2],
        status: "approved"
    });

    it("should add an order", async ()=>{
        const orderRepository = new CheckoutRepository();

        await orderRepository.addOrder(order);

        const orderModels = await CheckoutOrderModel.findAll({include: [
                {model: CheckoutClientModel},
                {model: CheckoutProductModel}
            ]});

        expect(orderModels.length).toBe(1);
        expect(orderModels[0].id).toBe(order.id.id);
        expect(orderModels[0].status).toBe(order.status);
        expect(orderModels[0].client.id).toBe(order.client.id.id);
        expect(orderModels[0].client.name).toBe(order.client.name);
        expect(orderModels[0].client.email).toBe(order.client.email);
        expect(orderModels[0].client.address).toBe(order.client.address);
        expect(orderModels[0].products.length).toBe(2);
        expect(orderModels[0].products[0].id).toBe(product1.id.id);
        expect(orderModels[0].products[0].name).toBe(product1.name);
        expect(orderModels[0].products[0].description).toBe(product1.description);
        expect(orderModels[0].products[0].salesprice).toBe(product1.salesPrice);
        expect(orderModels[0].products[1].id).toBe(product2.id.id);
        expect(orderModels[0].products[1].name).toBe(product2.name);
        expect(orderModels[0].products[1].description).toBe(product2.description);
        expect(orderModels[0].products[1].salesprice).toBe(product2.salesPrice);
    });

    it("should find an order", async () =>{
        await CheckoutOrderModel.create({
            id: order.id.id,
            client: {
                id: order.client.id.id,
                name: order.client.name,
                address: order.client.address,
                email: order.client.email,
            },
            products: order.products.map((product) => {
                return {
                    id: product.id.id,
                    name: product.name,
                    description: product.description,
                    salesprice: product.salesPrice
                }
            }),
            status: order.status
            },
            {
                include: [
                    { model: CheckoutClientModel },
                    { model: CheckoutProductModel }
                ]
            });
        
        const orderRepository = new CheckoutRepository();

        const orderResult = await orderRepository.findOrder(order.id.id);

        expect(orderResult.id.id).toBe(order.id.id);
        expect(orderResult.status).toBe(order.status);
        expect(orderResult.client.id.id).toBe(order.client.id.id);
        expect(orderResult.client.name).toBe(order.client.name);
        expect(orderResult.client.email).toBe(order.client.email);
        expect(orderResult.client.address).toBe(order.client.address);
        expect(orderResult.products.length).toBe(2);
        expect(orderResult.products[0].id.id).toBe(product1.id.id);
        expect(orderResult.products[0].name).toBe(product1.name);
        expect(orderResult.products[0].description).toBe(product1.description);
        expect(orderResult.products[0].salesPrice).toBe(product1.salesPrice);
        expect(orderResult.products[1].id.id).toBe(product2.id.id);
        expect(orderResult.products[1].name).toBe(product2.name);
        expect(orderResult.products[1].description).toBe(product2.description);
        expect(orderResult.products[1].salesPrice).toBe(product2.salesPrice);

    });

})