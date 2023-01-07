import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Invoice from "../../domain/invoice.entity";
import Address from "../../domain/value-objects/address.client.invoice.value-object";
import Client from "../../domain/value-objects/client.invoice.value-object";
import InvoiceItem from "../../domain/value-objects/item.invoice.value-object";
import InvoiceGateway from "../../gateway/invoice.gateway.interface";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generate.invoice.usecase.dto";

export default class GenerateInvoiceUseCase implements UseCaseInterface{
    private invoiceRepository: InvoiceGateway;

    constructor(invoiceRepository: InvoiceGateway) {
        this.invoiceRepository = invoiceRepository;
    }

    async execute(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
        const invoice = this.invoiceFromInputDto(input);
        const result = await this.invoiceRepository.save(invoice);
        return this.outputDtoFromInvoice(invoice);
    }

    private outputDtoFromInvoice(invoice: Invoice): GenerateInvoiceUseCaseOutputDto {
        return {
            id: invoice.id.id,
            name: invoice.client.name,
            city: invoice.client.address.city,
            complement: invoice.client.address.complement,
            document: invoice.client.document,
            number: invoice.client.address.number,
            state: invoice.client.address.state,
            street: invoice.client.address.street,
            zipCode: invoice.client.address.zipcode,
            total: invoice.total,
            items: invoice.items.map((item)=>{return {id: item.id, name: item.name, price: item.price}})
        };
    }


    private invoiceFromInputDto(input: GenerateInvoiceUseCaseInputDto): Invoice {
        const address = new Address({
            city: input.city, 
            complement: input.complement, 
            street: input.street, 
            zipcode: input.zipCode, 
            number: input.number, 
            state: input.state});

        const client = new Client({name: input.name, address: address, document: input.document});

        const items = this.itemsFromInputDto(input);

        return new Invoice({client: client, items: items});
    }

    private itemsFromInputDto(input: GenerateInvoiceUseCaseInputDto): Array<InvoiceItem> {
        return input.items.map((item)=> new InvoiceItem({id: item.id, name: item.name, price: item.price}));
    }

}