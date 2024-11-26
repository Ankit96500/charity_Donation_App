
import { DataTypes,Model} from "sequelize";
import sequelize from "../config/database.js";
import User from "./userM.js";
import Charity from "./charityM.js";

class Registration extends Model{
}
Registration.init({
        id:{
            type:DataTypes.INTEGER,
            allowNull:false,
            autoIncrement:true,
            primaryKey:true
        },  
        charity_ID:{
            type:DataTypes.INTEGER,
            references:{
                model:Charity,
                key:"id"
            }
        },
        username:DataTypes.STRING,
        status:{
            type:DataTypes.BOOLEAN,
            defaultValue:false,
        },
        user_ID:{
            type:DataTypes.INTEGER,
            references:{
                model:User,
                key:"id"
            }
        }


    },{
        sequelize,
        freezeTableName:true
    }
)

export default Registration;


