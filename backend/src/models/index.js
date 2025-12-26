const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");

// ✅ ROOT DATABASE FILE (keeps your old data safe)
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "../../hms.sqlite"),
  logging: false, // optional: reduces console spam
});

// Load Models
const Employee   = require("./employee")(sequelize, DataTypes);
const Patient    = require("./patient")(sequelize, DataTypes);
const Attendance = require("./attendance")(sequelize, DataTypes);
const Revenue    = require("./revenue")(sequelize, DataTypes);
const HomeVisit  = require("./homeVisit")(sequelize, DataTypes);
const Admin      = require("./admin")(sequelize, DataTypes);
const OpBooking  = require("./opBooking")(sequelize, DataTypes);

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
