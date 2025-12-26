const { Patient, sequelize } = require("./models");

(async () => {
  await sequelize.sync();

  const data = [
    { name: "Bhargavi", age: 22, gender: "Female", phone: "9990001111", condition: "Fever" },
    { name: "Saraswathi", age: 45, gender: "Female", phone: "8882223333", condition: "Checkup" },
    { name: "Anu", age: 29, gender: "Female", phone: "7774445555", condition: "Cold" }
  ];

  for (const p of data) {
    await Patient.create(p);
  }

  console.log("Patients added!");
  process.exit();
})();
