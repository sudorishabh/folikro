import {
  integer,
  pgTable,
  timestamp,
  varchar,
  uuid,
  text,
  boolean,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";

// ============ ENUMS ============

export const widgetTypeEnum = pgEnum("widget_type", [
  "link",
  "social",
  "text",
  "image",
  "embed",
  "header",
  "spacer",
]);

export const socialPlatformEnum = pgEnum("social_platform", [
  "github",
  "twitter",
  "linkedin",
  "instagram",
  "youtube",
  "substack",
  "gumroad",
  "dribbble",
  "medium",
  "spotify",
  "other",
]);

// ============ USERS TABLE ============

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar({ length: 255 }).notNull().unique(),
  username: varchar({ length: 30 }).notNull().unique(), // URL slug: folikro.com/username
  password: varchar({ length: 255 }),
  name: varchar({ length: 255 }).notNull(),
  avatar: text("avatar"), // Profile picture URL
  bio: text("bio"), // Short bio
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============ PAGES TABLE ============

export const pagesTable = pgTable("pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  title: varchar({ length: 100 }).notNull(),
  description: text("description"),
  isPublished: boolean("is_published").default(true),
  isDefault: boolean("is_default").default(false), // Main page for username

  // Grid settings
  columns: integer("columns").default(4), // Number of grid columns
  rowHeight: integer("row_height").default(100), // Height of each row in px
  gap: integer("gap").default(16), // Gap between widgets in px

  // Analytics
  views: integer("views").default(0),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============ WIDGETS TABLE ============

export const widgetsTable = pgTable("widgets", {
  id: uuid("id").primaryKey().defaultRandom(),
  pageId: uuid("page_id")
    .notNull()
    .references(() => pagesTable.id, { onDelete: "cascade" }),

  // Widget type
  type: widgetTypeEnum("type").notNull().default("link"),

  // Grid position (for GridStack/react-grid-layout)
  gridX: integer("grid_x").notNull().default(0), // X position
  gridY: integer("grid_y").notNull().default(0), // Y position
  gridW: integer("grid_w").notNull().default(1), // Width in grid units
  gridH: integer("grid_h").notNull().default(1), // Height in grid units

  // Content
  title: varchar({ length: 100 }),
  url: text("url"), // Link URL
  description: text("description"),
  icon: text("icon"), // Icon URL or icon name
  image: text("image"), // Image URL for image widgets

  // Social/Platform specific
  platform: socialPlatformEnum("platform"), // For social links
  platformUsername: varchar("platform_username", { length: 100 }), // e.g., @username

  // Styling (JSON for flexibility)
  style: jsonb("style").$type<{
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: number;
    fontSize?: string;
    fontWeight?: string;
    backgroundImage?: string;
    animation?: string;
  }>(),

  // Analytics
  clicks: integer("clicks").default(0),

  // Ordering & visibility
  sortOrder: integer("sort_order").default(0),
  isVisible: boolean("is_visible").default(true),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============ PAGE THEMES TABLE ============

export const pageThemesTable = pgTable("page_themes", {
  id: uuid("id").primaryKey().defaultRandom(),
  pageId: uuid("page_id")
    .notNull()
    .references(() => pagesTable.id, { onDelete: "cascade" })
    .unique(),

  // Colors
  backgroundColor: varchar({ length: 20 }).default("#0a0a0a"),
  backgroundGradient: text("background_gradient"), // CSS gradient
  backgroundImage: text("background_image"), // Background image URL
  primaryColor: varchar({ length: 20 }).default("#ffffff"),
  secondaryColor: varchar({ length: 20 }).default("#888888"),
  accentColor: varchar({ length: 20 }).default("#3b82f6"),

  // Typography
  fontFamily: varchar({ length: 100 }).default("Inter"),
  headingFont: varchar({ length: 100 }),

  // Widget defaults
  widgetBackground: varchar({ length: 20 }).default("#1a1a1a"),
  widgetBorderRadius: integer("widget_border_radius").default(12),
  widgetBorderColor: varchar({ length: 20 }),

  // Custom CSS (Pro feature)
  customCss: text("custom_css"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const analyticsTable = pgTable("analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  pageId: uuid("page_id").references(() => pagesTable.id, {
    onDelete: "cascade",
  }),
  widgetId: uuid("widget_id").references(() => widgetsTable.id, {
    onDelete: "cascade",
  }),
  eventType: varchar({ length: 20 }).notNull(), // "view", "click"
  referrer: text("referrer"),
  country: varchar({ length: 2 }),
  device: varchar({ length: 20 }), // "mobile", "desktop", "tablet"
  createdAt: timestamp("created_at").defaultNow(),
});

export const templatesTable = pgTable("templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  name: varchar({ length: 100 }).notNull(),
  description: text("description"),
  thumbnail: text("thumbnail"), // Preview image URL
  layout: jsonb("layout"), // Saved widget positions & styles
  theme: jsonb("theme"), // Saved theme settings
  isPublic: boolean("is_public").default(false),
  usageCount: integer("usage_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const subscriptionsTable = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" })
    .unique(),
  plan: varchar({ length: 20 }).notNull().default("free"), // "free", "pro", "enterprise"
  status: varchar({ length: 20 }).notNull().default("active"), // "active", "cancelled", "past_due"
  stripeCustomerId: varchar({ length: 100 }),
  stripeSubscriptionId: varchar({ length: 100 }),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const oauthConnectionsTable = pgTable("oauth_connections", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  provider: varchar({ length: 50 }).notNull(), // "github", "spotify", "twitter"
  providerUserId: varchar({ length: 100 }).notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
