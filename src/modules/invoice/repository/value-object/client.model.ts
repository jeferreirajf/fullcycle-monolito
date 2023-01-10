import { BelongsTo, Column, ForeignKey, HasOne, Model, PrimaryKey, Table } from "sequelize-typescript";
import { InvoiceModel } from "../invoice.model";
import {InvoiceClientAddressModel} from "./address.model";

@Table({
    tableName: "invoice_client",
    timestamps: false
})
export class InvoiceClientModel extends Model {
    @PrimaryKey
    @Column
    declare id: string;

    @ForeignKey(() => InvoiceModel)
    @Column({ allowNull: false })
    declare invoice_id: string;

    @BelongsTo(()=>InvoiceModel)
    declare invoice: InvoiceModel;

    @HasOne(() => InvoiceClientAddressModel)
    declare address: InvoiceClientAddressModel;

    @Column({allowNull: false})
    name: string;

    @Column({allowNull: false})
    document: string;
}