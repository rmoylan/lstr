import { builder } from "../builder";
import prisma from "../../lib/prisma";

const CreateListCommentInput = builder.inputType("CreateListCommentInput", {
  fields: (t) => ({
    message: t.string({ required: true }),
    authorId: t.string({ required: true }),
    listId: t.string({ required: true }),
  }),
});

builder.prismaObject("ListComment", {
  fields: (t) => ({
    id: t.exposeID("id"),
    createdAt: t.expose("createdAt", {
      type: "Date",
    }),
    updatedAt: t.expose("updateAt", {
      type: "Date",
    }),
    userId: t.exposeString("authorId"),
    listId: t.exposeString("listId"),
    message: t.exposeString("message"),
  }),
});

builder.queryField("listComments", (t) =>
  t.prismaField({
    type: ["ListComment"],
    resolve: async (query, root, args, ctx, info) =>
      prisma.listComment.findMany({ ...query }),
  })
);

builder.mutationField("createListComment", (t) =>
  t.prismaField({
    type: "ListComment",
    nullable: true,
    args: {
      input: t.arg({ type: CreateListCommentInput, required: true }),
    },
    errors: {
      types: [Error],
    },
    resolve: async (query, _, { input }) => {
      return prisma.listComment.create({
        ...query,
        data: {
          message: input.message,
          authorId: input.authorId,
          listId: input.listId,
        },
      });
    },
  })
);
