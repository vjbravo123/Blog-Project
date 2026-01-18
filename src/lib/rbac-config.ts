// File: lib/access.ts or config/access.ts

/**
 * Role-Based Access Control (RBAC) Configuration
 * Defines permissions and access levels for different user roles in the Blog CMS
 */

export type Role = 'superadmin' | 'admin' | 'editor' | 'staff' | 'viewer';

export interface Permission {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  publish?: boolean;
  bulk?: boolean;
}

export interface Feature {
  name: string;
  path: string;
  roles: Role[];
  permissions: Record<Role, Permission>;
  description: string;
}

// Default permission sets for quick reference
const FULL_ACCESS: Permission = {
  create: true,
  read: true,
  update: true,
  delete: true,
  publish: true,
  bulk: true,
};

const READ_WRITE: Permission = {
  create: true,
  read: true,
  update: true,
  delete: false,
  publish: false,
  bulk: false,
};

const READ_ONLY: Permission = {
  create: false,
  read: true,
  update: false,
  delete: false,
  publish: false,
  bulk: false,
};

const NO_ACCESS: Permission = {
  create: false,
  read: false,
  update: false,
  delete: false,
  publish: false,
  bulk: false,
};

/**
 * CMS Features with Role-based Access Control
 */
export const CMS_FEATURES: Record<string, Feature> = {
  // ==================== DASHBOARD ====================
  overview: {
    name: 'Overview Dashboard',
    path: '/admin/dashboard',
    roles: ['superadmin', 'admin', 'editor', 'staff', 'viewer'],
    permissions: {
      superadmin: { ...FULL_ACCESS },
      admin: { ...READ_ONLY },
      editor: { ...READ_ONLY },
      staff: { ...READ_ONLY },
      viewer: { ...READ_ONLY },
    },
    description: 'View system statistics, traffic analytics, and key metrics',
  },

  // ==================== BLOG POST MANAGEMENT ====================
  posts: {
    name: 'Post Management',
    path: '/admin/posts',
    roles: ['superadmin', 'admin', 'editor', 'staff', 'viewer'],
    permissions: {
      superadmin: { ...FULL_ACCESS },
      admin: { ...FULL_ACCESS },
      editor: {
        create: true,
        read: true,
        update: true,
        delete: true,
        publish: true, // Editors can publish
        bulk: true,
      },
      staff: {
        create: true,
        read: true,
        update: true, // Can update own drafts
        delete: false,
        publish: false, // Staff creates drafts, cannot publish
        bulk: false,
      },
      viewer: { ...READ_ONLY },
    },
    description: 'Manage blog posts, articles, and drafts',
  },

  // ==================== CATEGORIES & TAGS ====================
  categories: {
    name: 'Categories & Tags',
    path: '/admin/categories',
    roles: ['superadmin', 'admin', 'editor'],
    permissions: {
      superadmin: { ...FULL_ACCESS },
      admin: { ...FULL_ACCESS },
      editor: {
        create: true,
        read: true,
        update: true,
        delete: false, // Editors shouldn't delete categories (breaks links)
        publish: true,
        bulk: false,
      },
      staff: { ...NO_ACCESS }, // Staff selects categories, doesn't manage them
      viewer: { ...NO_ACCESS },
    },
    description: 'Manage content taxonomy',
  },

  // ==================== MEDIA / IMAGES ====================
  media: {
    name: 'Media Library',
    path: '/admin/media',
    roles: ['superadmin', 'admin', 'editor', 'staff'],
    permissions: {
      superadmin: { ...FULL_ACCESS },
      admin: { ...FULL_ACCESS },
      editor: { ...FULL_ACCESS },
      staff: {
        create: true, // Can upload images for their posts
        read: true,
        update: false,
        delete: false,
        publish: false,
      },
      viewer: { ...NO_ACCESS },
    },
    description: 'Upload and manage images and files',
  },

  // ==================== USER MANAGEMENT ====================
  users: {
    name: 'User Management',
    path: '/admin/users',
    roles: ['superadmin', 'admin'],
    permissions: {
      superadmin: { ...FULL_ACCESS },
      admin: {
        create: true,
        read: true,
        update: true,
        delete: false, // Admin cannot delete users, only Superadmin
        publish: false,
        bulk: false,
      },
      editor: { ...NO_ACCESS },
      staff: { ...NO_ACCESS },
      viewer: { ...NO_ACCESS },
    },
    description: 'Manage admin users, authors, and roles',
  },

  // ==================== SETTINGS ====================
  settings: {
    name: 'System Settings',
    path: '/admin/settings',
    roles: ['superadmin'],
    permissions: {
      superadmin: { ...FULL_ACCESS },
      admin: { ...NO_ACCESS },
      editor: { ...NO_ACCESS },
      staff: { ...NO_ACCESS },
      viewer: { ...NO_ACCESS },
    },
    description: 'Configure SEO, Global Scripts, and Site Metadata',
  },
};

/**
 * Check if a user role has access to a specific feature
 */
export function hasFeatureAccess(userRole: Role, featureKey: string): boolean {
  const feature = CMS_FEATURES[featureKey];
  if (!feature) return false;
  return feature.roles.includes(userRole);
}

/**
 * Get permissions for a specific role on a feature
 */
export function getPermissions(userRole: Role, featureKey: string): Permission {
  const feature = CMS_FEATURES[featureKey];
  if (!feature) return NO_ACCESS;
  return feature.permissions[userRole] || NO_ACCESS;
}

/**
 * Check if a user can perform a specific action
 */
export function canPerformAction(
  userRole: Role,
  featureKey: string,
  action: keyof Permission
): boolean {
  const permissions = getPermissions(userRole, featureKey);
  return permissions[action] === true;
}

/**
 * Get all accessible features for a role
 */
export function getAccessibleFeatures(userRole: Role): Feature[] {
  return Object.values(CMS_FEATURES).filter(feature =>
    feature.roles.includes(userRole)
  );
}

/**
 * Role hierarchy
 */
export const ROLE_HIERARCHY: Record<Role, number> = {
  viewer: 1,
  staff: 2, // Equivalent to 'Author' or 'Contributor'
  editor: 3,
  admin: 4,
  superadmin: 5,
};

/**
 * Check if a role has higher privileges than another
 */
export function hasHigherRole(role1: Role, role2: Role): boolean {
  return ROLE_HIERARCHY[role1] > ROLE_HIERARCHY[role2];
}