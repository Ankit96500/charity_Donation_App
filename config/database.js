import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config()

console.log('-->',process.env.DB_NAME);

const sequelize = new Sequelize(
    process.env.DB_NAME || "localdb",
    process.env.DB_USER || "localuser",
    process.env.DB_PASSWORD || "localpwd",{
        dialect:'mysql',
        host:process.env.DB_HOST || "localhost",
        pool:{
            max:5,
            min:2,
            acquire:60000,
            idle:10000
        },
        logging:false
    },
);


export default sequelize;
