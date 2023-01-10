import { Column, HasMany, HasOne, Model, PrimaryKey, Table } from "sequelize-typescript";
import { InvoiceClientModel } from "./value-object/client.model";
import { InvoiceItemModel } from "./value-object/invoice-item.model";

@Table({
    tableName: "invoice",
    timestamps: false
})
export class InvoiceModel extends Model {

    @PrimaryKey
    @Column({ allowNull: false })
    declare id: string;

    @HasOne(() => InvoiceClientModel)
    declare client: InvoiceClientModel;

    @HasMany(() => InvoiceItemModel)
    declare items: InvoiceItemModel[];

    @Column({ allowNull: false })
    declare total: number;

    @Column({ allowNull: false })
    createdAt: Date;

    @Column({ allowNull: false })
    updatedAt: Date;
}