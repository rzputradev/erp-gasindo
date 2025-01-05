const { Command } = require('commander');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const program = new Command();
const db = new PrismaClient();

program
   .name('init')
   .description('Create initial data in the database')
   .version('1.0.0')
   .option('-n, --name <name>', 'Name of the user', 'John Doe')
   .option('-e, --email <email>', 'Email of the user', 'example@mail.com')
   .option('-p, --password <password>', 'Password for the user', 'password')
   .option(
      '-g, --gender <gender>',
      'Gender of the user (MALE or FEMALE)',
      (value) => value.toUpperCase(),
      'MALE'
   );

program.action(async (options) => {
   const { name, email, password, gender } = options;

   try {
      // Validate gender
      if (!['MALE', 'FEMALE'].includes(gender)) {
         throw new Error('Gender must be either MALE or FEMALE.');
      }

      // Validate email format (basic validation)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
         throw new Error('Invalid email format.');
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the user in the database
      const newUser = await db.user.create({
         data: {
            name,
            email,
            password: hashedPassword,
            gender,
            status: 'ACTIVE',
            emailVerified: new Date()
         }
      });

      console.log('User created successfully');
   } catch (error) {
      console.error('Error creating user:', error.message);
   } finally {
      await db.$disconnect();
   }
});

program.parse(process.argv);
