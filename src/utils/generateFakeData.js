import { faker } from '@faker-js/faker';
 
 function generateFakeData(num = 100) {
   const data = [];
 
   for (let i = 0; i < num; i++) {
     data.push({
       id: i + 1,
       name: faker.name.fullName(),  
       developer: faker.name.fullName(),
       year: faker.number.int({ min: 1900, max: 2025 }), 
       description: faker.lorem.sentence(),
     });
   }
 
   return data;
 }
 
 export default generateFakeData;