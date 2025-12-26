const {sequelize,Employee}=require('./models');
(async()=>{
 await sequelize.sync({force:true});
 await Employee.bulkCreate([
 {name:'Dr. Emily Chen',role:'Senior Physiotherapist',status:'ACTIVE',rating:4.8,sessionsDone:156,experience:'8y',patients:24},
 {name:'Dr. James Wilson',role:'Rehabilitation Specialist',status:'ACTIVE',rating:4.6,sessionsDone:142,experience:'6y',patients:38},
 {name:'Dr. Maria Garcia',role:'Physical Therapist',status:'ACTIVE',rating:4.2,sessionsDone:198,experience:'4y',patients:32}
 ]);
 console.log("Seed done");
 process.exit(0);
})();