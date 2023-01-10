import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import { CheckoutOrderModel } from "./order.model";
import { CheckoutClientModel } from "./value-objects/client.model";
import { CheckoutProductModel } from "./value-objects/product.model";

export class CheckoutRepository implements CheckoutGateway {
    async addOrder(order: Order): Promise<void> {
        try {
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
        }
        catch (error) {
            console.log(error);
            throw new Error("Could not include order in database");
        }
    }

    async findOrder(id: string): Promise<Order | null> {
        
        let order: Order = null;

        try {
            const result = await CheckoutOrderModel.findOne(
                {
                    where: { id },
                    include: [
                        { model: CheckoutClientModel },
                        { model: CheckoutProductModel }
                    ]
                },
            );

            if (result !== null) {
                const products = result.products.map((product) =>
                    new Product({
                        id: new Id(product.id),
                        name: product.name,
                        description: product.description,
                        salesPrice: product.salesprice
                    }));
                    
                const client = new Client({
                    id: new Id(result.client.id),
                    name: result.client.name,
                    address: result.client.address,
                    email: result.client.email
                });

                order = new Order({ id: new Id(result.id), products, client, status: result.status });
            }
        }
        catch (error) {
            console.log(error);
            throw new Error("Error while tryign find an order")
        }

        return order;
    }
}