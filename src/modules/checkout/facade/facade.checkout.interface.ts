export interface PlaceOrderFacadeInputDto {
    clientId: string;
    products: {
      productId: string;
    }[];
  }
  
  export interface PlaceOrderFacadeOutputDto {
    id: string;
    total: number;
    products: {
      productId: string;
    }[];
  }

  export interface FacadeCheckoutInterface{
    placeOrder(input: PlaceOrderFacadeInputDto): Promise<PlaceOrderFacadeOutputDto>;
  }