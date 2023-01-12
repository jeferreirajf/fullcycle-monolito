import express, { NextFunction, Request, Response } from "express";
import { AddClientFacadeInputDto } from "../../../modules/client-adm/facade/client-adm.facade.interface";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/client-adm.facade.factory";

export const clientRouter = express.Router();

clientRouter.post("/", async (req: Request, res: Response, next: NextFunction)=>{
    const clientService = ClientAdmFacadeFactory.create();

    try{
        const input: AddClientFacadeInputDto = {
            name: req.body.name,
            address: req.body.address,
            email: req.body.email,
        }

        await clientService.add(input);

        res.status(200).send({"message": "Client added sucessfully"});
    }
    catch(error){
        console.log(error);
        next(error);
    }
});