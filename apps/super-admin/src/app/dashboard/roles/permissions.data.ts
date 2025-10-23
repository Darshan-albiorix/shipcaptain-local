export type CrudFlags = { view: boolean; create: boolean; edit: boolean; delete: boolean };
export type PermissionItem = { id: string; name: string; flags?: CrudFlags };
export type PermissionCategory = { id: string; name: string; items: PermissionItem[] };

// Edit this list to add/remove permissions and categories.
// Only ids and names are required; flags are optional and default to false.
export const PERMISSION_CATEGORIES: PermissionCategory[] = [
  {
    id: "billing",
    name: "Billing",
    items: [
      { id: "billing", name: "Billing" },
      { id: "billing-profiles", name: "Billing Profiles" },
      { id: "invoices", name: "Invoices" },
      { id: "payments", name: "Payments" },
    ],
  },
  {
    id: "users",
    name: "Users",
    items: [
      { id: "users", name: "Users", flags: { view: true, create: false, edit: false, delete: false } },
      { id: "roles", name: "Roles", flags: { view: true, create: false, edit: false, delete: false } },
      { id: "teams", name: "Teams" },
    ],
  },
  {
    id: "orders",
    name: "Orders",
    items: [
      { id: "orders", name: "Orders" },
      { id: "returns", name: "Returns" },
      { id: "refunds", name: "Refunds" },
    ],
  },
  {
    id: "inventory",
    name: "Inventory",
    items: [
      { id: "inventory", name: "Inventory" },
      { id: "adjustments", name: "Adjustments" },
      { id: "stocktakes", name: "Stocktakes" },
    ],
  },
  {
    id: "shipping",
    name: "Shipping",
    items: [
      { id: "shipments", name: "Shipments" },
      { id: "labels", name: "Labels" },
      { id: "carriers", name: "Carriers" },
    ],
  },
  {
    id: "products",
    name: "Products",
    items: [
      { id: "products", name: "Products" },
      { id: "variants", name: "Variants" },
      { id: "bundles", name: "Bundles" },
      { id: "categories", name: "Categories" },
    ],
  },
  {
    id: "warehouses",
    name: "Warehouses",
    items: [
      { id: "warehouses", name: "Warehouses" },
      { id: "locations", name: "Locations" },
      { id: "transfers", name: "Transfers" },
    ],
  },
  {
    id: "reports",
    name: "Reports",
    items: [
      { id: "sales-reports", name: "Sales Reports" },
      { id: "inventory-reports", name: "Inventory Reports" },
      { id: "operations-reports", name: "Operations Reports" },
    ],
  },
  {
    id: "integrations",
    name: "Integrations",
    items: [
      { id: "api-keys", name: "API Keys" },
      { id: "webhooks", name: "Webhooks" },
      { id: "apps", name: "Apps" },
    ],
  },
  {
    id: "settings",
    name: "Settings",
    items: [
      { id: "organization", name: "Organization" },
      { id: "branding", name: "Branding" },
      { id: "preferences", name: "Preferences" },
    ],
  },
];


