-- This is an empty migration.-- ================================================
-- 🌱 Insert default Permission Groups & Permissions
-- ================================================

-- 1️⃣ Insert Permission Groups
INSERT INTO "PermissionGroup" ("id", "name", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid(), 'Billing', now(), now()),
  (gen_random_uuid(), 'Bins', now(), now()),
  (gen_random_uuid(), 'Customers', now(), now()),
  (gen_random_uuid(), 'Cycle Count', now(), now()),
  (gen_random_uuid(), 'Dashboard', now(), now()),
  (gen_random_uuid(), 'Emails', now(), now()),
  (gen_random_uuid(), 'Exports', now(), now()),
  (gen_random_uuid(), 'License Plate Numbers', now(), now()),
  (gen_random_uuid(), 'Locations', now(), now()),
  (gen_random_uuid(), 'Orders', now(), now()),
  (gen_random_uuid(), 'Packers', now(), now()),
  (gen_random_uuid(), 'Pickers', now(), now()),
  (gen_random_uuid(), 'Printing', now(), now()),
  (gen_random_uuid(), 'Products', now(), now()),
  (gen_random_uuid(), 'Purchase Orders', now(), now()),
  (gen_random_uuid(), 'Reports', now(), now()),
  (gen_random_uuid(), 'Settings', now(), now()),
  (gen_random_uuid(), 'Shipping', now(), now()),
  (gen_random_uuid(), 'Statuses', now(), now()),
  (gen_random_uuid(), 'Stores', now(), now()),
  (gen_random_uuid(), 'Totes', now(), now()),
  (gen_random_uuid(), 'Users', now(), now()),
  (gen_random_uuid(), 'Vendors', now(), now()),
  (gen_random_uuid(), 'Warehouses', now(), now()),
  (gen_random_uuid(), 'Wholesale', now(), now()),
  (gen_random_uuid(), 'Work Orders', now(), now()),
  (gen_random_uuid(), 'WorkforceHero', now(), now());

-- 2️⃣ Insert Permissions per Group

-- Helper: insert function for each group
-- Each VALUES list below matches your JS array structure.

-- Billing
INSERT INTO "Permission" ("id", "groupId", "name", "key", "createdAt", "updatedAt")
SELECT gen_random_uuid(), pg.id, p.name, p.key, now(), now()
FROM (VALUES
  ('Billing', 'billing'),
  ('Billing Profiles', 'billing_profiles')
) AS p(name, key)
JOIN "PermissionGroup" pg ON pg."name" = 'Billing';

-- Bins
INSERT INTO "Permission" ("id", "groupId", "name", "key", "createdAt", "updatedAt")
SELECT gen_random_uuid(), pg.id, p.name, p.key, now(), now()
FROM (VALUES
  ('Bins', 'bins')
) AS p(name, key)
JOIN "PermissionGroup" pg ON pg."name" = 'Bins';

-- Customers
INSERT INTO "Permission" ("id", "groupId", "name", "key", "createdAt", "updatedAt")
SELECT gen_random_uuid(), pg.id, p.name, p.key, now(), now()
FROM (VALUES
  ('Customers', 'customers')
) AS p(name, key)
JOIN "PermissionGroup" pg ON pg."name" = 'Customers';

-- Cycle Count
INSERT INTO "Permission" ("id", "groupId", "name", "key", "createdAt", "updatedAt")
SELECT gen_random_uuid(), pg.id, p.name, p.key, now(), now()
FROM (VALUES
  ('Cycle Count Dashboard', 'cycle_count_dashboard'),
  ('Cycle Count Mobile', 'cycle_count_mobile')
) AS p(name, key)
JOIN "PermissionGroup" pg ON pg."name" = 'Cycle Count';

-- Dashboard
INSERT INTO "Permission" ("id", "groupId", "name", "key", "createdAt", "updatedAt")
SELECT gen_random_uuid(), pg.id, p.name, p.key, now(), now()
FROM (VALUES
  ('Hero Board', 'hero_board'),
  ('Labor Cost', 'labor_cost'),
  ('PostHero', 'posthero')
) AS p(name, key)
JOIN "PermissionGroup" pg ON pg."name" = 'Dashboard';

-- Emails
INSERT INTO "Permission" ("id", "groupId", "name", "key", "createdAt", "updatedAt")
SELECT gen_random_uuid(), pg.id, p.name, p.key, now(), now()
FROM (VALUES
  ('Emails', 'emails')
) AS p(name, key)
JOIN "PermissionGroup" pg ON pg."name" = 'Emails';

-- Exports
INSERT INTO "Permission" ("id", "groupId", "name", "key", "description", "createdAt", "updatedAt")
SELECT gen_random_uuid(), pg.id, p.name, p.key, p.description, now(), now()
FROM (VALUES
  ('Restrict Exports', 'restrict_exports', NULL),
  ('Restrict exports', 'restrict_exports_note', 'Checking this box will restrict all export options')
) AS p(name, key, description)
JOIN "PermissionGroup" pg ON pg."name" = 'Exports';

-- License Plate Numbers
INSERT INTO "Permission" ("id", "groupId", "name", "key", "createdAt", "updatedAt")
SELECT gen_random_uuid(), pg.id, p.name, p.key, now(), now()
FROM (VALUES
  ('License Plate Numbers', 'license_plate_numbers')
) AS p(name, key)
JOIN "PermissionGroup" pg ON pg."name" = 'License Plate Numbers';

-- Repeat pattern for remaining groups...
-- For brevity, only showing a few more examples:

-- Products
INSERT INTO "Permission" ("id", "groupId", "name", "key", "description", "createdAt", "updatedAt")
SELECT gen_random_uuid(), pg.id, p.name, p.key, p.description, now(), now()
FROM (VALUES
  ('Inventory Location', 'inventory_location', 'Checking this box will allow the user to move inventory (Transfers and Putaway)'),
  ('Inventory Upload', 'inventory_upload', NULL),
  ('Products', 'products', 'This permission includes product details and manual inventory updates')
) AS p(name, key, description)
JOIN "PermissionGroup" pg ON pg."name" = 'Products';

-- Orders
INSERT INTO "Permission" ("id", "groupId", "name", "key", "createdAt", "updatedAt")
SELECT gen_random_uuid(), pg.id, p.name, p.key, now(), now()
FROM (VALUES
  ('Automation Rules', 'automation_rules'),
  ('Orders', 'orders'),
  ('Upload CSV', 'upload_csv')
) AS p(name, key)
JOIN "PermissionGroup" pg ON pg."name" = 'Orders';

-- Users
INSERT INTO "Permission" ("id", "groupId", "name", "key", "createdAt", "updatedAt")
SELECT gen_random_uuid(), pg.id, p.name, p.key, now(), now()
FROM (VALUES
  ('Users', 'users'),
  ('Payroll', 'payroll')
) AS p(name, key)
JOIN "PermissionGroup" pg ON pg."name" = 'Users';

-- Warehouses
INSERT INTO "Permission" ("id", "groupId", "name", "key", "createdAt", "updatedAt")
SELECT gen_random_uuid(), pg.id, p.name, p.key, now(), now()
FROM (VALUES
  ('Warehouses', 'warehouses')
) AS p(name, key)
JOIN "PermissionGroup" pg ON pg."name" = 'Warehouses';

-- Wholesale
INSERT INTO "Permission" ("id", "groupId", "name", "key", "createdAt", "updatedAt")
SELECT gen_random_uuid(), pg.id, p.name, p.key, now(), now()
FROM (VALUES
  ('Manager', 'wholesale_manager'),
  ('Packer', 'wholesale_packer'),
  ('Picker', 'wholesale_picker')
) AS p(name, key)
JOIN "PermissionGroup" pg ON pg."name" = 'Wholesale';

-- WorkforceHero
INSERT INTO "Permission" ("id", "groupId", "name", "key", "createdAt", "updatedAt")
SELECT gen_random_uuid(), pg.id, p.name, p.key, now(), now()
FROM (VALUES
  ('WorkforceHero', 'workforcehero')
) AS p(name, key)
JOIN "PermissionGroup" pg ON pg."name" = 'WorkforceHero';


--------------- new missing migration------------

-- Locations
INSERT INTO "Permission" ("id", "groupId", "name", "key", "createdAt", "updatedAt")
SELECT gen_random_uuid(), pg.id, 'Locations', 'locations', now(), now()
FROM "PermissionGroup" pg WHERE pg."name" = 'Locations';

-- Packers
INSERT INTO "Permission" ("id", "groupId", "name", "key", "createdAt", "updatedAt")
SELECT gen_random_uuid(), pg.id, 'Packers', 'packers', now(), now()
FROM "PermissionGroup" pg WHERE pg."name" = 'Packers';

-- Pickers
INSERT INTO "Permission" ("id", "groupId", "name", "key", "createdAt", "updatedAt")
SELECT gen_random_uuid(), pg.id, 'Pickers', 'pickers', now(), now()
FROM "PermissionGroup" pg WHERE pg."name" = 'Pickers';

-- Printing
INSERT INTO "Permission" ("id", "groupId", "name", "key", "createdAt", "updatedAt")
SELECT gen_random_uuid(), pg.id, 'Printing Stations', 'printing_stations', now(), now()
FROM "PermissionGroup" pg WHERE pg."name" = 'Printing';

-- Purchase Orders
INSERT INTO "Permission" ("id", "groupId", "name", "key", "createdAt", "updatedAt")
SELECT gen_random_uuid(), pg.id, 'Purchase Orders', 'purchase_orders', now(), now()
FROM "PermissionGroup" pg WHERE pg."name" = 'Purchase Orders';

-- Reports
INSERT INTO "Permission" ("id", "groupId", "name", "key", "createdAt", "updatedAt")
SELECT gen_random_uuid(), pg.id, 'Reports', 'reports', now(), now()
FROM "PermissionGroup" pg WHERE pg."name" = 'Reports';

-- Settings
INSERT INTO "Permission" ("id", "groupId", "name", "key", "createdAt", "updatedAt")
SELECT gen_random_uuid(), pg.id, 'Settings', 'settings', now(), now()
FROM "PermissionGroup" pg WHERE pg."name" = 'Settings';

-- Shipping
INSERT INTO "Permission" ("id", "groupId", "name", "key", "createdAt", "updatedAt")
SELECT gen_random_uuid(), pg.id, p.name, p.key, now(), now()
FROM (VALUES
  ('Shipping Carriers', 'shipping_carriers'),
  ('Shipping Options', 'shipping_options')
) AS p(name, key)
JOIN "PermissionGroup" pg ON pg."name" = 'Shipping';

-- Statuses
INSERT INTO "Permission" ("id", "groupId", "name", "key", "createdAt", "updatedAt")
SELECT gen_random_uuid(), pg.id, 'Order, Purchase Order, Return Statuses', 'statuses', now(), now()
FROM "PermissionGroup" pg WHERE pg."name" = 'Statuses';

-- Stores
INSERT INTO "Permission" ("id", "groupId", "name", "key", "createdAt", "updatedAt")
SELECT gen_random_uuid(), pg.id, 'Stores', 'stores', now(), now()
FROM "PermissionGroup" pg WHERE pg."name" = 'Stores';

-- Totes
INSERT INTO "Permission" ("id", "groupId", "name", "key", "createdAt", "updatedAt")
SELECT gen_random_uuid(), pg.id, 'Totes', 'totes', now(), now()
FROM "PermissionGroup" pg WHERE pg."name" = 'Totes';

-- Vendors
INSERT INTO "Permission" ("id", "groupId", "name", "key", "createdAt", "updatedAt")
SELECT gen_random_uuid(), pg.id, 'Vendors', 'vendors', now(), now()
FROM "PermissionGroup" pg WHERE pg."name" = 'Vendors';

-- Work Orders
INSERT INTO "Permission" ("id", "groupId", "name", "key", "createdAt", "updatedAt")
SELECT gen_random_uuid(), pg.id, 'Work Orders', 'work_orders', now(), now()
FROM "PermissionGroup" pg WHERE pg."name" = 'Work Orders';
