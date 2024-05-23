const Queue = require('bull');
const xlsx = require('xlsx');
const Employee = require('../models/employee');
const redisConfig = {
  host: 'redis', // Use 'redis' if you are using Docker, otherwise use '127.0.0.1'
  port: 6379,
};

const employeeUploadQueue = new Queue('employeeUpload', { redis: redisConfig });

employeeUploadQueue.process(10, async (job) => { // Set concurrency to 10
  const { fileBuffer } = job.data;
  const workbook = xlsx.read(fileBuffer.data, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const employees = xlsx.utils.sheet_to_json(worksheet);

  console.log('Processing employees:', employees); // Log the employees being processed

  if (!employees || employees.length === 0) {
    console.log('No employees found in the Excel file.');
    return;
  }

  const bulkOps = [];

  for (const emp of employees) {
    
    const existingEmployee = await Employee.findOne({
      $or: [{ email: emp.email }, { mobile: emp.mobile }],
    });

    if (!existingEmployee) {
      bulkOps.push({
        insertOne: {
          document: {
            username: emp.username,
            email: emp.email,
            password: emp.password,
            address: emp.address,
            mobile: emp.mobile,
            annualSalary: emp.annualSalary,
            jobTitle: emp.jobTitle,
            userRole: emp.userRole || 'employee',
          }
        }
      });
    } else {
      console.log(`Employee with email ${emp.email} or mobile ${emp.mobile} already exists.`);
    }
  }

  console.log('Bulk operations:', bulkOps); // Log the bulk operations

  if (bulkOps.length > 0) {
    await Employee.bulkWrite(bulkOps);
    console.log(`${bulkOps.length} employees inserted.`);
  } else {
    console.log('No new employees to insert.');
  }
});

module.exports = employeeUploadQueue;
