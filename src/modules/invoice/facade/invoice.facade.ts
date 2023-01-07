import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, { FindInvoiceFacadeInputDTO, FindInvoiceFacadeOutputDTO, GenerateInvoiceFacadeInputDto, GenerateInvoiceFacadeOutputDto } from "./invoice.facade.interface";

type InvoiceFacadeProps = {
    find: UseCaseInterface;
    generate: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface{

    private findInvoiceUsecase: UseCaseInterface;
    private generateInvoiceUsecase: UseCaseInterface;

    constructor(props: InvoiceFacadeProps) {
        this.findInvoiceUsecase = props.find;
        this.generateInvoiceUsecase = props.generate;
    }

    async find(input: FindInvoiceFacadeInputDTO): Promise<FindInvoiceFacadeOutputDTO> {
        return await this.findInvoiceUsecase.execute(input);
    }

    async generate(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto> {
        return await this.generateInvoiceUsecase.execute(input);
    }

}