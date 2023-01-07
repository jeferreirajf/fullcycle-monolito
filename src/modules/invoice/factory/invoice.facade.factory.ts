import InvoiceFacade from "../facade/invoice.facade";
import InvoiceRepository from "../repository/invoice.repository";
import FindInvoiceUseCase from "../usecase/find/find.invoice.usecase";
import GenerateInvoiceUseCase from "../usecase/generate/generate.invoice.usecase";

export default class InvoiceFacadeFactory{
    static create(): InvoiceFacade{
        const invoiceRepository = new InvoiceRepository();
        const invoiceFindUsecase = new FindInvoiceUseCase(invoiceRepository);
        const innvoiceGenerateUsecase = new GenerateInvoiceUseCase(invoiceRepository);
        const invoiceFacade = new InvoiceFacade({find: invoiceFindUsecase, generate: innvoiceGenerateUsecase});

        return invoiceFacade;
    }
}