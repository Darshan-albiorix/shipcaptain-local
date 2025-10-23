-- ===============================================
-- 🚀 Create SUPER_ADMIN Role + Assign All Permissions + Admin User
-- ===============================================

-- 1️⃣ Ensure SUPER_ADMIN role exists
INSERT INTO "Role" ("id", "name", "description", "isActive", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'SUPER_ADMIN',
  'System Super Admin with full access to all permissions',
  TRUE,
  NOW(),
  NOW()
)
ON CONFLICT ("name") DO NOTHING;

-- 2️⃣ Capture the SUPER_ADMIN role id
DO $$
DECLARE
  super_admin_id TEXT;
BEGIN
  SELECT "id" INTO super_admin_id FROM "Role" WHERE "name" = 'SUPER_ADMIN';

  -- 3️⃣ Assign every permission to SUPER_ADMIN
  INSERT INTO "RolePermission" ("id", "roleId", "permissionId", "canView", "canCreate", "canEdit", "canDelete")
  SELECT
    gen_random_uuid(),
    super_admin_id,
    p."id",
    TRUE,
    TRUE,
    TRUE,
    TRUE
  FROM "Permission" p
  LEFT JOIN "RolePermission" rp
    ON rp."roleId" = super_admin_id AND rp."permissionId" = p."id"
  WHERE rp."id" IS NULL;

  -- 4️⃣ Create the Super Admin user
  INSERT INTO "admin" (
    "id",
    "username",
    "password",
    "email",
    "firstName",
    "lastName",
    "isActive",
    "createdAt",
    "updatedAt",
    "roleId"
  )
  VALUES (
    'admin_default_001',
    'admin',
    '$2b$10$wINHUfo3htgkS.W2zhLb.Oq17WCmwtGGv3/0c1W/OvnVz2rNbRSU2',
    'admin@shipcaptain.com',
    'System',
    'Administrator',
    TRUE,
    NOW(),
    NOW(),
    super_admin_id
  )
  ON CONFLICT ("email") DO NOTHING;

  -- 5️⃣ Optional: Log creation
  INSERT INTO "AdminActionLog" ("logId", "adminId", "actionType", "notes", "timestamp")
  SELECT
    gen_random_uuid(),
    'admin_default_001',
    'ADMIN_CREATION',
    'System-generated SUPER_ADMIN created via migration.',
    NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM "AdminActionLog"
    WHERE "adminId" = 'admin_default_001' AND "actionType" = 'ADMIN_CREATION'
  );
END $$;