import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Invoice from "../../domain/invoice.entity";
import InvoiceGateway from "../../gateway/invoice.gateway.interface";
import { FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO } from "./find.invoice.usecase.dto";

export default class FindInvoiceUseCase implements UseCaseInterface{
    private invoiceRepository: InvoiceGateway;
    constructor(invoiceRepository: InvoiceGateway){
        this.invoiceRepository = invoiceRepository;
    }

    async execute(input: FindInvoiceUseCaseInputDTO): Promise<FindInvoiceUseCaseOutputDTO> {
        const invoice = await this.invoiceRepository.find(input.id);

        if(invoice === null){
            throw new Error(`Invoice ${input.id} was not found`);
        }

        return this.convertInvoiceToDto(invoice);
    }

    private convertInvoiceToDto(invoice: Invoice) : FindInvoiceUseCaseOutputDTO{

        const items = invoice.items.map((item)=>{
            return {id: item.id, name: item.name, price: item.price}
        });

        return {
            id: invoice.id.id,
            name: invoice.client.name,
            document: invoice.client.document,
            address: {
                street: invoice.client.address.street,
                number: invoice.client.address.number,
                complement: invoice.client.address.complement,
                city: invoice.client.address.city,
                state: invoice.client.address.state,
                zipCode: invoice.client.address.zipcode,
            },
            items: items,
            total: invoice.total,
            createdAt: invoice.createdAt,
        }
    }
}