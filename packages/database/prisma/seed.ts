import { PrismaClient } from '../src/generated/client/index.js'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding from migration data...')

  // 1. Create Permission Groups (from migration 20251017111857_insert_permission_groups)
  console.log('📋 Creating permission groups...')
  const permissionGroups = [
    'Billing',
    'Bins',
    'Customers',
    'Cycle Count',
    'Dashboard',
    'Emails',
    'Exports',
    'License Plate Numbers',
    'Locations',
    'Orders',
    'Packers',
    'Pickers',
    'Printing',
    'Products',
    'Purchase Orders',
    'Reports',
    'Settings',
    'Shipping',
    'Statuses',
    'Stores',
    'Totes',
    'Users',
    'Vendors',
    'Warehouses',
    'Wholesale',
    'Work Orders',
    'WorkforceHero'
  ]

  const createdGroups: { id: string; name: string }[] = []
  for (const groupName of permissionGroups) {
    const group = await prisma.permissionGroup.upsert({
      where: { id: groupName },
    update: {},
    create: {
        id: groupName,
        name: groupName,
      }
    })
    createdGroups.push(group)
  }
  
  const permissions = [
    // Billing
    { groupName: 'Billing', name: 'Billing', key: 'billing' },
    { groupName: 'Billing', name: 'Billing Profiles', key: 'billing_profiles' },
    
    // Bins
    { groupName: 'Bins', name: 'Bins', key: 'bins' },
    
    // Customers
    { groupName: 'Customers', name: 'Customers', key: 'customers' },
    
    // Cycle Count
    { groupName: 'Cycle Count', name: 'Cycle Count Dashboard', key: 'cycle_count_dashboard' },
    { groupName: 'Cycle Count', name: 'Cycle Count Mobile', key: 'cycle_count_mobile' },
    
    // Dashboard
    { groupName: 'Dashboard', name: 'Hero Board', key: 'hero_board' },
    { groupName: 'Dashboard', name: 'Labor Cost', key: 'labor_cost' },
    { groupName: 'Dashboard', name: 'PostHero', key: 'posthero' },
    
    // Emails
    { groupName: 'Emails', name: 'Emails', key: 'emails' },
    
    // Exports
    { groupName: 'Exports', name: 'Restrict Exports', key: 'restrict_exports' },
    { groupName: 'Exports', name: 'Restrict exports', key: 'restrict_exports_note', description: 'Checking this box will restrict all export options' },
    
    // License Plate Numbers
    { groupName: 'License Plate Numbers', name: 'License Plate Numbers', key: 'license_plate_numbers' },
    
    // Locations
    { groupName: 'Locations', name: 'Locations', key: 'locations' },
    
    // Orders
    { groupName: 'Orders', name: 'Automation Rules', key: 'automation_rules' },
    { groupName: 'Orders', name: 'Orders', key: 'orders' },
    { groupName: 'Orders', name: 'Upload CSV', key: 'upload_csv' },
    
    // Packers
    { groupName: 'Packers', name: 'Packers', key: 'packers' },
    
    // Pickers
    { groupName: 'Pickers', name: 'Pickers', key: 'pickers' },
    
    // Printing
    { groupName: 'Printing', name: 'Printing Stations', key: 'printing_stations' },
    
    // Products
    { groupName: 'Products', name: 'Inventory Location', key: 'inventory_location', description: 'Checking this box will allow the user to move inventory (Transfers and Putaway)' },
    { groupName: 'Products', name: 'Inventory Upload', key: 'inventory_upload' },
    { groupName: 'Products', name: 'Products', key: 'products', description: 'This permission includes product details and manual inventory updates' },
    
    // Purchase Orders
    { groupName: 'Purchase Orders', name: 'Purchase Orders', key: 'purchase_orders' },
    
    // Reports
    { groupName: 'Reports', name: 'Reports', key: 'reports' },
    
    // Settings
    { groupName: 'Settings', name: 'Settings', key: 'settings' },
    
    // Shipping
    { groupName: 'Shipping', name: 'Shipping Carriers', key: 'shipping_carriers' },
    { groupName: 'Shipping', name: 'Shipping Options', key: 'shipping_options' },
    
    // Statuses
    { groupName: 'Statuses', name: 'Order, Purchase Order, Return Statuses', key: 'statuses' },
    
    // Stores
    { groupName: 'Stores', name: 'Stores', key: 'stores' },
    
    // Totes
    { groupName: 'Totes', name: 'Totes', key: 'totes' },
    
    // Users
    { groupName: 'Users', name: 'Users', key: 'users' },
    { groupName: 'Users', name: 'Payroll', key: 'payroll' },
    
    // Vendors
    { groupName: 'Vendors', name: 'Vendors', key: 'vendors' },
    
    // Warehouses
    { groupName: 'Warehouses', name: 'Warehouses', key: 'warehouses' },
    
    // Wholesale
    { groupName: 'Wholesale', name: 'Manager', key: 'wholesale_manager' },
    { groupName: 'Wholesale', name: 'Packer', key: 'wholesale_packer' },
    { groupName: 'Wholesale', name: 'Picker', key: 'wholesale_picker' },
    
    // Work Orders
    { groupName: 'Work Orders', name: 'Work Orders', key: 'work_orders' },
    
    // WorkforceHero
    { groupName: 'WorkforceHero', name: 'WorkforceHero', key: 'workforcehero' },
  ]

  for (const permission of permissions) {
    const group = createdGroups.find((g: { name: string, id: string }) => g.name === permission.groupName)
    if (group) {
    await prisma.permission.upsert({
      where: { key: permission.key },
      update: {},
        create: {
          groupId: group.id,
          name: permission.name,
          key: permission.key,
          description: permission.description ? permission.description : null,
          canView: false,
          canCreate: false,
          canEdit: false,
          canDelete: false,
        },
      })
    }
  }

  // 3. Create Roles
  console.log('👑 Creating roles...')
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'SUPER_ADMIN' },
    update: {},
    create: {
      name: 'SUPER_ADMIN',
      description: 'System Super Admin with full access to all permissions',
      isActive: true,
    },
  })

  const adminRole = await prisma.role.upsert({
    where: { name: 'Administrator' },
    update: {},
    create: {
      name: 'Administrator',
      description: 'Administrative access with limited permissions',
      isActive: true,
    },
  })

  const managerRole = await prisma.role.upsert({
    where: { name: 'Manager' },
    update: {},
    create: {
      name: 'Manager',
      description: 'Management level access with restricted permissions',
      isActive: true,
    },
  })

  const operatorRole = await prisma.role.upsert({
    where: { name: 'Operator' },
    update: {},
    create: {
      name: 'Operator',
      description: 'Basic operational access with minimal permissions',
      isActive: true,
    },
  })

  const viewerRole = await prisma.role.upsert({
    where: { name: 'Viewer' },
    update: {},
    create: {
      name: 'Viewer',
      description: 'Read-only access with no modification permissions',
      isActive: true,
    },
  })

  // 4. Assign permissions to roles
  console.log('🔗 Assigning permissions to roles...')
  const allPermissions = await prisma.permission.findMany()
  
  // SUPER_ADMIN gets all permissions with true values
  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: superAdminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: superAdminRole.id,
        permissionId: permission.id,
        canView: true,
        canCreate: true,
        canEdit: true,
        canDelete: true,
      },
    })
  }

  // All other roles get all permissions with false values
  const otherRoles = [adminRole, managerRole, operatorRole, viewerRole]
  for (const role of otherRoles) {
    for (const permission of allPermissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permission.id,
          canView: false,
          canCreate: false,
          canEdit: false,
          canDelete: false,
        },
      })
    }
  }

  // 5. Create Admin User (from migration 20251023124529_create_super_admin)
  console.log('👤 Creating admin user...')
  const adminUser = await prisma.admin.upsert({
    where: { email: 'admin@shipcaptain.com' },
    update: {},
    create: {
      id: 'admin_default_001',
      username: 'admin',
      password: '$2b$10$wINHUfo3htgkS.W2zhLb.Oq17WCmwtGGv3/0c1W/OvnVz2rNbRSU2', // admin123
      email: 'admin@shipcaptain.com',
      firstName: 'System',
      lastName: 'Administrator',
      isActive: true,
      roleId: superAdminRole.id,
    },
  })

  // 6. Create Admin Action Log (from migration 20251023124529_create_super_admin)
  console.log('📝 Creating admin action log...')
  const existingLog = await prisma.adminActionLog.findFirst({
    where: {
      adminId: adminUser.id,
      actionType: 'ADMIN_CREATION',
    },
  })
  
  if (!existingLog) {
    await prisma.adminActionLog.create({
      data: {
        logId: `log_${adminUser.id}_${Date.now()}`,
        adminId: adminUser.id,
        actionType: 'ADMIN_CREATION',
        notes: 'System-generated SUPER_ADMIN created via migration.',
      },
    })
  }

  console.log('✅ Database seeding completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`- Permission Groups: ${permissionGroups.length}`)
  console.log(`- Permissions: ${permissions.length}`)
  console.log(`- Roles: 5 (SUPER_ADMIN, Administrator, Manager, Operator, Viewer)`)
  console.log(`- Admin User: 1`)
  console.log('\n🔑 Default Admin Credentials:')
  console.log('Username: admin')
  console.log('Password: admin123')
  console.log('Email: admin@shipcaptain.com')
  console.log('Role: SUPER_ADMIN (all permissions = true)')
  console.log('\n📝 Other Roles:')
  console.log('- Administrator, Manager, Operator, Viewer (all permissions = false)')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })