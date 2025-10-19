import { Sequelize } from "sequelize";
import createUserModel from "../model/userModel.js";

let User = null;

export const dbConnection = async (databse, username, password) => {
  console.log(password);
  try {
    const sequelize = new Sequelize(databse, username, password, {
      host: "localhost",
      port: 5433,
      dialect: "postgres",
    });
    await sequelize.authenticate();
    User = await createUserModel(sequelize);
    await sequelize.sync({ alter: true });
    console.log("Connection to databse sucessfull");
  } catch (e) {
    console.log(e.message);
  }
};

export { User };
