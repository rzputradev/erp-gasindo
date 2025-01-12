const { Command } = require('commander');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const program = new Command();
const db = new PrismaClient();

// Load permissions and roles JSON files
const permissions = JSON.parse(
   fs.readFileSync(path.join(__dirname, 'permissions.json'), 'utf8')
);

const roles = JSON.parse(
   fs.readFileSync(path.join(__dirname, 'roles.json'), 'utf8')
);

program
   .name('init')
   .description('Create initial data in the database')
   .version('1.0.0');

program.action(async () => {
   try {
      // Hash the password
      const hashedPassword = await bcrypt.hash('password', 10);

      console.log('Creating permissions...');
      // Insert permissions into the database
      for (const permission of permissions) {
         await db.permission.upsert({
            where: { key: permission.key },
            update: {},
            create: {
               key: permission.key,
               name: permission.name,
               description: permission.description
            }
         });
      }

      console.log('Permissions created successfully.');

      console.log('Creating roles...');
      // Insert roles into the database
      for (const role of roles) {
         const createdRole = await db.role.upsert({
            where: { key: role.key },
            update: {},
            create: {
               key: role.key,
               name: role.name,
               description: role.description
            }
         });

         // Add permissions to the role
         for (const permissionKey of role.permissions) {
            const permission = await db.permission.findUnique({
               where: { key: permissionKey }
            });

            if (permission) {
               await db.rolePermission.upsert({
                  where: {
                     roleId_permissionId: {
                        roleId: createdRole.id,
                        permissionId: permission.id
                     }
                  },
                  update: {},
                  create: {
                     roleId: createdRole.id,
                     permissionId: permission.id
                  }
               });
            }
         }
      }

      console.log('Roles created successfully.');

      // Create the initial user with the super-admin role
      await db.user.create({
         data: {
            name: 'Super Admin',
            email: 'super@admin.com',
            password: hashedPassword,
            gender: 'MALE',
            status: 'ACTIVE',
            emailVerified: new Date(),
            role: {
               connect: { key: 'super-admin' }
            }
         }
      });

      console.log('Initial user created successfully:', {
         email: 'super@admin.com',
         password: 'password'
      });
   } catch (error) {
      console.error('Error initializing the database:', error.message);
   } finally {
      await db.$disconnect();
   }
});

program.parse(process.argv);
