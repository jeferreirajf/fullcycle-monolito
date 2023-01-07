import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import ClientModel from "./client.model";

@Table({
    tableName: "address",
    timestamps: false,
})
export default class AddressModel extends Model {
    @PrimaryKey
    @Column
    declare id: string;

    @ForeignKey(()=>ClientModel)
    @Column({allowNull: false})
    declare client_id: string;

    @BelongsTo(()=>ClientModel)
    declare client: ClientModel;

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