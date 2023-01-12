import express, { NextFunction, Request, Response } from "express";
import { CheckoutFacadeFactory } from "../../../modules/checkout/factory/checkout.facade.factory";

export const checkoutRouter = express.Router();

checkoutRouter.post("/", async (req: Request, res: Response, next: NextFunction) =>{
    try{
        const checkoutFacade = CheckoutFacadeFactory.create();
        const result = await checkoutFacade.placeOrder({
            clientId: req.body.clientId,
            products: req.body.products
        });

        res.status(200).send(result);
    }
    catch(error){
        next(error);
    }
});