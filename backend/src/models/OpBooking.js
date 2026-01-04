module.exports = (sequelize, DataTypes) => {
  const OpBooking = sequelize.define("OpBooking", {
    token: {
      type: DataTypes.STRING,        // ✅ STRING (IMPORTANT FIX)
      allowNull: false,
      unique: true,
    },

    patientName: {
      type: DataTypes.STRING,
      allowNull: false,
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

    visitTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Pending",
    },
  });

  return OpBooking;
};
