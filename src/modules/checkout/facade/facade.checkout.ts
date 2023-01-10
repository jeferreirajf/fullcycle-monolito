import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import { FacadeCheckoutInterface, PlaceOrderFacadeInputDto, PlaceOrderFacadeOutputDto } from "./facade.checkout.interface";

export class FacadeCheckout implements FacadeCheckoutInterface{

    private _placeOrder: UseCaseInterface;

    constructor(placeOrder: UseCaseInterface){
        this._placeOrder = placeOrder;
    }

    async placeOrder(input: PlaceOrderFacadeInputDto): Promise<PlaceOrderFacadeOutputDto> {
        return await this._placeOrder.execute(input); 
    }
}