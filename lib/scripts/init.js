const { Command } = require('commander');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const program = new Command();
const db = new PrismaClient();

// Load JSON files
const permissions = JSON.parse(
   fs.readFileSync(path.join(__dirname, 'permissions.json'), 'utf8')
);

const roles = JSON.parse(
   fs.readFileSync(path.join(__dirname, 'roles.json'), 'utf8')
);

const categories = JSON.parse(
   fs.readFileSync(path.join(__dirname, 'categories.json'), 'utf8')
);

const items = JSON.parse(
   fs.readFileSync(path.join(__dirname, 'items.json'), 'utf8')
);

program
   .name('init')
   .description('Create initial data in the database')
   .version('1.0.0');

program.action(async () => {
   try {
      // Hash the password
      const hashedPassword = await bcrypt.hash('password', 10);

      console.log('Creating item categories...');
      for (const category of categories) {
         await db.itemCategory.upsert({
            where: { key: category.key },
            update: {},
            create: {
               key: category.key,
               name: category.name,
               description: category.description
            }
         });
      }
      console.log('Item categories created successfully.');

      console.log('Creating items...');
      for (const item of items) {
         await db.item.upsert({
            where: { key: item.key },
            update: {},
            create: {
               key: item.key,
               name: item.name,
               description: item.description,
               unit: item.unit, // Assuming unit is already validated as per your Prisma model
               categories: {
                  connect: item.categories.map((categoryKey) => ({
                     key: categoryKey
                  }))
               }
            }
         });
      }
      console.log('Items created successfully.');

      console.log('Creating permissions...');
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

      await db.user.create({
         data: {
            name: 'Super Admin',
            email: 'superadmin@mail.com',
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
         email: 'superadmin@mail.com',
         password: 'password'
      });
   } catch (error) {
      console.error('Error initializing the database:', error.message);
   } finally {
      await db.$disconnect();
   }
});

program.parse(process.argv);
