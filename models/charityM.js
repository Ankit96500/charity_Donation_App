
import { DataTypes,Model} from "sequelize";
import sequelize from "../config/database.js";
import bUser from "./businessUserM.js";

class Charity extends Model{
}
Charity.init({
        id:{
            type:DataTypes.INTEGER,
            allowNull:false,
            autoIncrement:true,
            primaryKey:true
        },  
        name:{type:DataTypes.STRING,},
        picture:{type:DataTypes.STRING},
        location:{type:DataTypes.STRING},
        donation:{type:DataTypes.STRING},
        goal:{type:DataTypes.STRING},
        bUser_ID:{
            type:DataTypes.INTEGER,
            references:{
                model:bUser,
                key:"id"
            }
        }


    },{
        sequelize,
        freezeTableName:true
    }
)

export default Charity;


