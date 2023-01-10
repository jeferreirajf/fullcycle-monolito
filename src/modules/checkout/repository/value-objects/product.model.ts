import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { CheckoutOrderModel } from "../order.model";

@Table({
    tableName: "checkout_product",
    timestamps: false
})
export class CheckoutProductModel extends Model{

    @PrimaryKey
    @Column({allowNull: false})
    declare id: string;

    @ForeignKey(()=>CheckoutOrderModel)
    declare order_id: string;

    @BelongsTo(()=>CheckoutOrderModel)
    declare order: CheckoutOrderModel;

    @Column({allowNull: false})
    declare name: string;

    @Column({allowNull: false})
    declare description: string;

    @Column({allowNull: false})
    declare salesprice: number;
}