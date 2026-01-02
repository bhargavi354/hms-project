const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");

const isProduction = process.env.NODE_ENV === "production";

const sequelize = isProduction
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      protocol: "postgres",
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    })
  : new Sequelize({
      dialect: "sqlite",
      storage: path.join(__dirname, "../../hms.sqlite"),
      logging: false,
    });

/* ===== MODELS ===== */
const Employee   = require("./employee")(sequelize, DataTypes);
const Patient    = require("./patient")(sequelize, DataTypes);
const Attendance = require("./attendance")(sequelize, DataTypes);
const Revenue    = require("./revenue")(sequelize, DataTypes);
const HomeVisit  = require("./homeVisit")(sequelize, DataTypes);
const Admin      = require("./admin")(sequelize, DataTypes);
const OpBooking  = require("./OpBooking")(sequelize, DataTypes);

module.exports = {
  sequelize,
  Employee,
  Patient,
  Attendance,
  Revenue,
  HomeVisit,
  Admin,
  OpBooking,
};
