module.exports = (sequelize, DataTypes) => {
  const OpInvoice = sequelize.define("OpInvoice", {
    opId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,   // ⭐ one OP = one bill
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    patientName: {
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
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Paid",
    },
  });

  return OpInvoice;
};
