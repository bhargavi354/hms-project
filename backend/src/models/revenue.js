module.exports = (sequelize, DataTypes) => {
  const Revenue = sequelize.define("Revenue", {
    invoiceNo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    patientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },

    opId: DataTypes.INTEGER,
    token: DataTypes.STRING,
    doctor: DataTypes.STRING,
    visitTime: DataTypes.STRING,

    amount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    date: {
      type: DataTypes.STRING,
      allowNull: true, // old rows safe
    },
  });

  return Revenue;
};
