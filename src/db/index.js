import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  // process.env.DB_NAME,
  // process.env.DB_USERNAME,
  // process.env.DB_PASSWORD,
  "blogdb",
  "root",
  "Uk123456@",
  {
    //   host: process.env.DB_HOST,
    // host: cred.DB_HOST,
    host: "localhost",
    // host: "mysql-container", // here container name
    // port:3306,
    dialect: "mysql",
    // dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export default sequelize;
