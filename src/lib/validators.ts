import { z } from "zod";

export const createEntitySchema = z.object({
  title: z.string().min(1, "Назва обов'язкова").max(200),
  description: z.string().max(5000).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  category: z.enum(["person", "company", "thing", "other"]),
  tags: z.array(z.string()).optional(),
});

export const createCommentSchema = z.object({
  content: z.string().min(1, "Коментар не може бути порожнім").max(2000),
  entityId: z.string().uuid(),
  parentId: z.string().uuid().optional().nullable(),
});

export const createReportSchema = z.object({
  targetType: z.enum(["entity", "comment"]),
  targetId: z.string().uuid(),
  reason: z.string().max(500).optional(),
});

export const voteSchema = z.object({
  entityId: z.string().uuid(),
  value: z.union([z.literal(1), z.literal(-1)]),
});

export type CreateEntityInput = z.infer<typeof createEntitySchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type CreateReportInput = z.infer<typeof createReportSchema>;
export type VoteInput = z.infer<typeof voteSchema>;
