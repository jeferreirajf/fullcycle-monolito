import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { CheckoutOrderModel } from "../modules/checkout/repository/order.model";
import { CheckoutClientModel } from "../modules/checkout/repository/value-objects/client.model";
import { CheckoutProductModel } from "../modules/checkout/repository/value-objects/product.model";
import { ClientModel } from "../modules/client-adm/repository/client.model";
import { InvoiceModel } from "../modules/invoice/repository/invoice.model";
import { InvoiceClientAddressModel } from "../modules/invoice/repository/value-object/address.model";
import { InvoiceClientModel } from "../modules/invoice/repository/value-object/client.model";
import { InvoiceItemModel } from "../modules/invoice/repository/value-object/invoice-item.model";
import TransactionModel from "../modules/payment/repository/transaction.model";
import { AdmProductModel } from "../modules/product-adm/repository/product.model";
import { CatalogProductModel } from "../modules/store-catalog/repository/product.model";
import { checkoutRouter } from "./routes/checkout/checkout.route";
import { clientRouter } from "./routes/client/client.route";
import { productRouter } from "./routes/product/product.route";

export const app: Express = express();
app.use(express.json());
app.use("/products", productRouter);
app.use("/clients", clientRouter);
app.use("/checkout", checkoutRouter);

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
  sequelize.addModels([
    AdmProductModel,
    CatalogProductModel,
    ClientModel,
    CheckoutClientModel,
    CheckoutProductModel,
    CheckoutOrderModel,
    InvoiceItemModel,
    InvoiceClientAddressModel,
    InvoiceClientModel,
    InvoiceModel,
    TransactionModel,
  ]);
  await sequelize.sync();
}
setupDb();