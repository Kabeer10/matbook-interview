import { and, count, desc, eq, like, or } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { workflows } from "~/server/db/schema";
import {
  getWorkflowsSchema,
  workflowCreateSchema,
  workflowUpdateSchema,
} from "~/server/validators/workflow";

function checkNumber(number: string) {
  const num = Number(number);

  if (Number.isNaN(num)) {
    return false;
  } else {
    return true;
  }
}

export const workflowRouter = createTRPCRouter({
  createWorkflow: protectedProcedure
    .input(workflowCreateSchema)
    .mutation(async ({ input, ctx }) => {
      console.log("input", ctx.session);
      const newWorkFlow = await db
        .insert(workflows)
        .values({
          ...input,
          createdById: ctx.session.user.id,
        })
        .returning();

      return {
        workflow: newWorkFlow[0],
      };
    }),

  updateWorkflow: protectedProcedure
    .input(workflowUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const updatedWorkflow = await db
        .update(workflows)
        .set({
          ...input,
          id: undefined,
        })
        .where(
          and(
            eq(workflows.id, input.id),
            eq(workflows.createdById, ctx.session.user.id),
          ),
        )
        .returning();

      if (updatedWorkflow.length === 0) {
        throw new Error("Workflow not found");
      }

      return {
        workflow: updatedWorkflow[0],
      };
    }),

  getWorkFlow: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const workflow = await db.query.workflows.findFirst({
        where: and(
          eq(workflows.id, input.id),
          eq(workflows.createdById, ctx.session.user.id),
        ),
      });

      return {
        workflow,
      };
    }),

  getWorkFlows: protectedProcedure
    .input(getWorkflowsSchema)
    .query(async ({ input, ctx }) => {
      const { limit, page, search } = input;
      console.log("search", search);
      const query = and(
        eq(workflows.createdById, ctx.session.user.id),
        search
          ? or(
              like(workflows.name, `%${search}%`),
              checkNumber(search)
                ? eq(workflows.id, Number(search))
                : undefined,
            )
          : undefined,
      );

      const [workflowData, total] = await Promise.all([
        db.query.workflows.findMany({
          where: query,
          limit,
          with: {
            user: {
              columns: {
                name: true,
              },
            },
          },
          columns: {
            nodes: false,
            edges: false,
          },
          offset: (page - 1) * limit,
          orderBy: [desc(workflows.isPinned), desc(workflows.updatedAt)],
        }),
        db.select({ count: count() }).from(workflows).where(query),
      ]);

      return {
        workflows: workflowData,
        total: total[0]?.count ?? 0,
      };
    }),

  deleteWorkflow: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const workflow = await db
        .delete(workflows)
        .where(
          and(
            eq(workflows.id, input.id),
            eq(workflows.createdById, ctx.session.user.id),
          ),
        )
        .returning();

      if (workflow.length === 0) {
        throw new Error("Workflow not found");
      }

      return {
        workflow: workflow[0],
      };
    }),
});
