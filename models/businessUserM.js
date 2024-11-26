
import { DataTypes,Model} from "sequelize";
import sequelize from "../config/database.js";


class bUser extends Model{
}
    bUser.init({
        id:{
            type:DataTypes.INTEGER,
            allowNull:false,
            autoIncrement:true,
            primaryKey:true
        },
        name:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        email:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true
        },
        phone_no:{
            type:DataTypes.STRING,
            defaultValue:"000",
        },
        organization_name:{type:DataTypes.STRING,defaultValue:"0000"},
        password:{
            type:DataTypes.STRING
        }

    },{
        sequelize,
        freezeTableName:true
    }
)

export default bUser;


