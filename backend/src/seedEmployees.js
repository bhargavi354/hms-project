const { sequelize, Employee } = require("./models");

async function seed() {
  await sequelize.sync();

  const sample = [
    { name: "Dr. Priya R", role: "Doctor", phone: "9991112222", salary: 50000 },
    { name: "Nurse Anu", role: "Nurse", phone: "8881113333", salary: 30000 },
    { name: "Receptionist Ram", role: "Reception", phone: "7771114444", salary: 25000 },
    { name: "Lab Tech Sai", role: "Lab", phone: "6661115555", salary: 28000 },
    { name: "Accountant Meena", role: "Accounts", phone: "5551116666", salary: 32000 }
  ];

  for (const emp of sample) {
    await Employee.create(emp);
  }

  console.log("Employees added!");
  process.exit();
}

seed();
