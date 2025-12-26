const { sequelize, Revenue } = require("./models");

async function seed() {
  await sequelize.sync();
  const sample = [
    {
      invoiceNo: "INV-1001",
      patientName: "Bhargavi",
      date: "2025-11-29",
      items: [{ desc: "Consultation", qty: 1, price: 500 }, { desc: "X-Ray", qty: 1, price: 700 }],
      totalAmount: 1200,
      status: "paid"
    },
    {
      invoiceNo: "INV-1002",
      patientName: "Ravi Kumar",
      date: "2025-11-28",
      items: [{ desc: "Lab Tests", qty: 1, price: 1500 }],
      totalAmount: 1500,
      status: "pending"
    },
  ];

  for (const r of sample) {
    await Revenue.create(r);
  }

  console.log("Revenue seeded!");
  process.exit();
}

seed();
