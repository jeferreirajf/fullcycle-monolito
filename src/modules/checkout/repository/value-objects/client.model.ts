import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { CheckoutOrderModel } from "../order.model";

@Table({
    tableName: "checkout_client",
    timestamps: false
})
export class CheckoutClientModel extends Model{

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
    declare email: string;

    @Column({allowNull: false})
    declare address: string;
}