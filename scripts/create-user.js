const { Command } = require('commander');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const program = new Command();

const db = new PrismaClient();

program
   .name('create-user')
   .description('CLI to create a new user in the database')
   .version('1.0.0');

program
   .requiredOption('-n, --name <name>', 'Name of the user')
   .requiredOption('-e, --email <email>', 'Email of the user')
   .requiredOption('-p, --password <password>', 'Password for the user')
   .option('-g, --gender <gender>', 'Gender of the user (MALE or FEMALE)', (value) => value.toUpperCase())
   .option('-s, --status <status>', 'Status of the user (ACTIVE, SUSPENDED, BLOCKED)', (value) => value.toUpperCase())
   .option('-r, --roleId <roleId>', 'Role ID for the user')
   .option('-v, --emailVerified <emailVerified>', 'Set email as verified (true or false)', (value) => value === 'true');

program.action(async (options) => {
   const { name, email, password, gender, status, roleId, emailVerified } = options;

   try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Set gender and status to enums
      const userGender = gender ? gender : undefined;  // If gender is provided, use it
      const userStatus = status ? status : 'SUSPENDED'; // Default to 'SUSPENDED' if no status provided

      // If emailVerified is true, set it to the current date, else set it to null
      const userEmailVerified = emailVerified ? new Date() : null;

      const newUser = await db.user.create({
         data: {
            name,
            email,
            password: hashedPassword,
            gender: userGender,      // Enum gender value
            status: userStatus,      // Enum status value
            roleId: roleId || null,  // Optional roleId
            emailVerified: userEmailVerified, // Set emailVerified to current date or null
         },
      });

      console.log('User created successfully:', newUser);
   } catch (error) {
      console.error('Error creating user:', error);
   } finally {
      await db.$disconnect();
   }
});

program.parse(process.argv);
