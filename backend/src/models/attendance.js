module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define("Attendance", {
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });

  return Attendance;
};
