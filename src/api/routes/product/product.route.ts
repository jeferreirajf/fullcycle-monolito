import express, { NextFunction, Request, Response } from "express";
import { AddProductFacadeInputDto } from "../../../modules/product-adm/facade/product-adm.facade.interface";
import ProductAdmFacadeFactory from "../../../modules/product-adm/factory/facade.factory";

export const productRouter = express.Router();

productRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
    const productAdmFacade = ProductAdmFacadeFactory.create();

    try{
        const productInsertAdmData: AddProductFacadeInputDto = {
            name: req.body.name,
            description: req.body.description,
            purchasePrice: req.body.purchasePrice,
            stock: req.body.stock,
        }

        await productAdmFacade.addProduct(productInsertAdmData);

        res.status(200).send({"message": "Product added successfully"});
    }
    catch(error){
        console.log(error);
        next(error);
    }
});

productRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
    const productAdmFacade = ProductAdmFacadeFactory.create();

    try{
        const productInsertAdmData: AddProductFacadeInputDto = {
            name: "req.body.name",
            description: "req.body.description",
            purchasePrice: 100,
            stock: 10,
        }

        await productAdmFacade.addProduct(productInsertAdmData);

        res.status(200).send({"message": "Product added successfully"});
    }
    catch(error){
        console.log(error);
        next(error);
    }
});