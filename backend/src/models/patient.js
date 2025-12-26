module.exports = (sequelize, DataTypes) => {
  const Patient = sequelize.define("Patient", {
    name: DataTypes.STRING,
    age: DataTypes.INTEGER,
    gender: DataTypes.STRING,
    phone: DataTypes.STRING,
    condition: DataTypes.STRING
  });

  return Patient;
};
