
import sequelize from "../config/database.js";
import { DataTypes, Model} from "sequelize";
import User from "./userM.js";


class Orders extends Model{}
    Orders.init({
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true,
            allowNull:false
        },
        paymentId:DataTypes.STRING,
        orderId:DataTypes.STRING,
        status:DataTypes.STRING,
        userID:{
            allowNull:false,
            type: DataTypes.INTEGER,
            references:{
                model:User,
                key:'id'
            }
        }
    },{
        freezeTableName:true,
        sequelize
    })

export default Orders
