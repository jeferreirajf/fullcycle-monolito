import express, { NextFunction, Request, Response } from "express";
import { CheckoutFacadeFactory } from "../../../modules/checkout/factory/checkout.facade.factory";

export const checkoutRouter = express.Router();

checkoutRouter.post("/", async (req: Request, res: Response, next: NextFunction) =>{
    try{
        const checkoutFacade = CheckoutFacadeFactory.create();
        const result = checkoutFacade.placeOrder({
            clientId: req.body.clientId,
            products: req.body.products
        });

        res.status(200).send(result);
    }
    catch(error){
        // res.status(500).send(error);
        next(error);
    }
});

checkoutRouter.get("/", async (req: Request, res: Response, next: NextFunction) =>{
    try{
        const checkoutFacade = CheckoutFacadeFactory.create();
        const result = checkoutFacade.placeOrder({
            clientId: "client1",
            products: [
                {productId: "idp1"},
                {productId: "idp2"}
            ]
        });

        res.status(200).send(result);
    }
    catch(error){
        // res.status(500).send(error);
        next(new Error(error.toString()));
    }
});