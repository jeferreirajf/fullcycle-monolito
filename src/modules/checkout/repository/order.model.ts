import { Column, HasMany, HasOne, Model, PrimaryKey, Table } from "sequelize-typescript";
import { ClientModel } from "../../client-adm/repository/client.model";
import { CheckoutClientModel } from "./value-objects/client.model";
import { CheckoutProductModel } from "./value-objects/product.model";

@Table({
    tableName: "order",
    timestamps: false
})
export class CheckoutOrderModel extends Model{
    @PrimaryKey
    @Column({allowNull: false})
    declare id: string;

    @HasOne(()=>CheckoutClientModel)
    declare client: ClientModel;

    @HasMany(()=>CheckoutProductModel)
    declare products: CheckoutProductModel[];

    @Column({allowNull: true})
    declare status: string;
}