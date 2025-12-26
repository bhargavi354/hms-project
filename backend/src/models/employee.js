// backend/src/models/employee.js

module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define("Employee", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dept: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "active",
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 4.5,
    },
    years: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    sessions: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    img: {
      // base64 string or image URL
      type: DataTypes.TEXT,
      allowNull: true,
    },
    nextShift: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "TBD",
    },
  });

  return Employee;
};
