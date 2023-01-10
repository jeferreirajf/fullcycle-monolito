import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import {InvoiceClientModel} from "./client.model";

@Table({
    tableName: "invoice_address",
    timestamps: false,
})
export class InvoiceClientAddressModel extends Model {
    @PrimaryKey
    @Column
    declare id: string;

    @ForeignKey(()=>InvoiceClientModel)
    @Column({allowNull: false})
    declare client_id: string;

    @BelongsTo(()=>InvoiceClientModel)
    declare client: InvoiceClientModel;

    @Column({allowNull: false})
    street: string;

    @Column({allowNull: false})
    number: string;

    @Column({allowNull: false})
    complement: string;

    @Column({allowNull: false})
    city: string;

    @Column({allowNull: false})
    state: string;

    @Column({allowNull: false})
    zipcode: string;
}