import { z } from "zod";

export const workflowCreateSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(256, "Name must be less than 256 characters"),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters"),
  nodes: z.array(z.any()).min(1, "At least one node is required"),
  edges: z.array(z.any()).min(1, "At least one edge is required"),
});

export type WorkflowCreateSchema = z.infer<typeof workflowCreateSchema>;

export const workflowUpdateSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(256, "Name must be less than 256 characters")
    .optional(),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  nodes: z.array(z.any()).min(1, "At least one node is required").optional(),
  edges: z.array(z.any()).min(1, "At least one edge is required").optional(),
  isPinned: z.boolean().optional(),
});

export const getWorkflowsSchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  page: z.number().min(1).default(1),
  search: z.string().optional(),
});
