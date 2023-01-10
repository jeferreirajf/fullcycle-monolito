import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
import { FacadeCheckout } from "../facade/facade.checkout";
import { FacadeCheckoutInterface } from "../facade/facade.checkout.interface";
import CheckoutGateway from "../gateway/checkout.gateway";
import { CheckoutRepository } from "../repository/order.repository";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";

export class CheckoutFacadeFactory{
    static create(): FacadeCheckoutInterface {
        const clientAdmFacade = ClientAdmFacadeFactory.create();
        const productAdmFacade = ProductAdmFacadeFactory.create();
        const catalogFacade = StoreCatalogFacadeFactory.create();
        const checkoutRepository: CheckoutGateway = new CheckoutRepository();

        const placeOrderUseCase = new PlaceOrderUseCase(
            clientAdmFacade, 
            productAdmFacade, 
            catalogFacade, 
            checkoutRepository);

        return new FacadeCheckout(placeOrderUseCase);
    }
}