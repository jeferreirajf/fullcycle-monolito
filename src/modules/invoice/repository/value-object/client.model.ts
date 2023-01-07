import { BelongsTo, Column, ForeignKey, HasOne, Model, PrimaryKey, Table } from "sequelize-typescript";
import { InvoiceModel } from "../invoice.model";
import AddressModel from "./address.model";

@Table({
    tableName: "client",
    timestamps: false
})
export default class ClientModel extends Model {
    @PrimaryKey
    @Column
    declare id: string;

    @ForeignKey(() => InvoiceModel)
    @Column({ allowNull: false })
    declare invoice_id: string;

    @BelongsTo(()=>InvoiceModel)
    declare invoice: InvoiceModel;

    @HasOne(() => AddressModel)
    declare address: AddressModel;

    @Column({allowNull: false})
    name: string;

    @Column({allowNull: false})
    document: string;
}