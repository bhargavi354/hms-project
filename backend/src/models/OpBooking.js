module.exports = (sequelize, DataTypes) => {
  const OpBooking = sequelize.define(
    "OpBooking",
    {
      token: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },

      // DB column = name
      patientName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "name",
      },

      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      gender: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      problem: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      doctor: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      // DB column = time
      visitTime: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "time",
      },

      status: {
        type: DataTypes.STRING,
        defaultValue: "Pending",
      },
    },
    {
      tableName: "OpBookings",
    }
  );

  return OpBooking;
};
