import { z } from 'zod';

// User validation schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  timezone: z.string().default('Europe/Moscow'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  timezone: z.string().optional(),
});

// Token validation schemas
export const createTokenSchema = z.object({
  category: z.enum(['STATISTICS', 'SUPPLIES', 'MARKETPLACE', 'CONTENT', 'PROMOTION', 'ANALYTICS', 'FINANCE']),
  token: z.string().min(1, 'Token is required'),
});

export const updateTokenSchema = z.object({
  token: z.string().min(1, 'Token is required').optional(),
  isActive: z.boolean().optional(),
});

// Warehouse preferences validation
export const warehousePrefSchema = z.object({
  warehouseId: z.number().int().positive('Warehouse ID must be positive'),
  warehouseName: z.string().min(1, 'Warehouse name is required'),
  enabled: z.boolean().default(true),
  boxAllowed: z.boolean().default(true),
  monopalletAllowed: z.boolean().default(true),
  supersafeAllowed: z.boolean().default(true),
});

// Task validation schemas
export const taskFiltersSchema = z.object({
  coefficientMin: z.number().min(0).max(20).default(0),
  coefficientMax: z.number().min(0).max(20).default(20),
  allowUnload: z.boolean().default(true),
  dates: z.object({
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
  }).optional(),
  boxTypeIds: z.array(z.number().int().positive()).default([5, 6]),
  warehouseIds: z.array(z.number().int().positive()).min(1, 'At least one warehouse must be selected'),
});

export const retryPolicySchema = z.object({
  maxRetries: z.number().int().min(0).max(10).default(3),
  backoffMs: z.number().int().min(1000).max(60000).default(5000),
});

export const createTaskSchema = z.object({
  name: z.string().min(1, 'Task name is required'),
  description: z.string().optional(),
  enabled: z.boolean().default(true),
  scheduleCron: z.string().optional(),
  autoBook: z.boolean().default(false),
  autoBookSupplyId: z.string().optional(),
  filters: taskFiltersSchema,
  retryPolicy: retryPolicySchema,
  priority: z.number().int().min(0).max(10).default(0),
});

export const updateTaskSchema = createTaskSchema.partial();

// Notification channel validation
export const emailNotificationSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const telegramNotificationSchema = z.object({
  chatId: z.string().min(1, 'Chat ID is required'),
});

export const webhookNotificationSchema = z.object({
  url: z.string().url('Invalid webhook URL'),
  secret: z.string().optional(),
});

export const notificationChannelSchema = z.object({
  type: z.enum(['EMAIL', 'TELEGRAM', 'WEBHOOK']),
  config: z.union([emailNotificationSchema, telegramNotificationSchema, webhookNotificationSchema]),
  enabled: z.boolean().default(true),
});

// API response schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

// Pagination schemas
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Search schemas
export const searchSchema = z.object({
  query: z.string().optional(),
  filters: z.record(z.any()).optional(),
  ...paginationSchema.shape,
});

// WB API specific schemas
export const wbCoefficientSchema = z.object({
  date: z.string(),
  warehouseId: z.number(),
  allowUnload: z.boolean(),
  coefficient: z.number().min(0).max(1),
});

export const wbWarehouseSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string().optional(),
  city: z.string().optional(),
});

export const wbSupplySchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.string(),
  warehouseId: z.number(),
  boxTypeId: z.number(),
  supplyDate: z.string().datetime().optional(),
  factDate: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
