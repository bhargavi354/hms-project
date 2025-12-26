module.exports = (sequelize, DataTypes) => {
  const HomeVisit = sequelize.define("HomeVisit", {
    patient: {
      type: DataTypes.STRING,
      allowNull: false
    },
    staff: {
      type: DataTypes.STRING,
      allowNull: false
    },
    visitType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Scheduled"
    }
  });

  return HomeVisit;
};
