import { PrismaClient } from '../../src/generated/client/index.js';

const prisma = new PrismaClient();

async function main() {
  // 1️⃣ Insert Permission Groups
  const permissionGroups = [
    'Billing', 'Bins', 'Customers', 'Cycle Count', 'Dashboard', 'Emails',
    'Exports', 'License Plate Numbers', 'Locations', 'Orders', 'Packers', 
    'Pickers', 'Printing', 'Products', 'Purchase Orders', 'Reports', 'Settings', 
    'Shipping', 'Statuses', 'Stores', 'Totes', 'Users', 'Vendors', 'Warehouses', 
    'Wholesale', 'Work Orders', 'WorkforceHero'
  ];

  for (const groupName of permissionGroups) {
    await prisma.permissionGroup.create({
      data: {
        name: groupName,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  // 2️⃣ Insert Permissions per Group
  const permissions = [
    { groupName: 'Billing', permissions: [
      { name: 'Billing', key: 'billing' },
      { name: 'Billing Profiles', key: 'billing_profiles' },
    ]},
    { groupName: 'Bins', permissions: [
      { name: 'Bins', key: 'bins' },
    ]},
    { groupName: 'Customers', permissions: [
      { name: 'Customers', key: 'customers' },
    ]},
    { groupName: 'Cycle Count', permissions: [
      { name: 'Cycle Count Dashboard', key: 'cycle_count_dashboard' },
      { name: 'Cycle Count Mobile', key: 'cycle_count_mobile' },
    ]},
    { groupName: 'Dashboard', permissions: [
      { name: 'Hero Board', key: 'hero_board' },
      { name: 'Labor Cost', key: 'labor_cost' },
      { name: 'PostHero', key: 'posthero' },
    ]},
    { groupName: 'Emails', permissions: [
      { name: 'Emails', key: 'emails' },
    ]},
    { groupName: 'Exports', permissions: [
      { name: 'Restrict Exports', key: 'restrict_exports' },
      { name: 'Restrict exports', key: 'restrict_exports_note', description: 'Checking this box will restrict all export options' },
    ]},
    { groupName: 'License Plate Numbers', permissions: [
      { name: 'License Plate Numbers', key: 'license_plate_numbers' },
    ]},
    { groupName: 'Products', permissions: [
      { name: 'Inventory Location', key: 'inventory_location', description: 'Checking this box will allow the user to move inventory (Transfers and Putaway)' },
      { name: 'Inventory Upload', key: 'inventory_upload' },
      { name: 'Products', key: 'products', description: 'This permission includes product details and manual inventory updates' },
    ]},
    { groupName: 'Orders', permissions: [
      { name: 'Automation Rules', key: 'automation_rules' },
      { name: 'Orders', key: 'orders' },
      { name: 'Upload CSV', key: 'upload_csv' },
    ]},
    { groupName: 'Users', permissions: [
      { name: 'Users', key: 'users' },
      { name: 'Payroll', key: 'payroll' },
    ]},
    { groupName: 'Warehouses', permissions: [
      { name: 'Warehouses', key: 'warehouses' },
    ]},
    { groupName: 'Wholesale', permissions: [
      { name: 'Manager', key: 'wholesale_manager' },
      { name: 'Packer', key: 'wholesale_packer' },
      { name: 'Picker', key: 'wholesale_picker' },
    ]},
    { groupName: 'WorkforceHero', permissions: [
      { name: 'WorkforceHero', key: 'workforcehero' },
    ]},
  ];

  for (const group of permissions) {
    const groupRecord = await prisma.permissionGroup.findFirst({
      where: { name: group.groupName },
    });
    for (const perm of group.permissions) {
      await prisma.permission.create({
        data: {
          groupId: groupRecord?.id || '',
          name: perm.name,
          key: perm.key,
          description: perm.description || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


export default main;