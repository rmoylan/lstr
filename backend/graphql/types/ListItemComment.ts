import { builder } from "../builder";
import prisma from "../../lib/prisma";

const CreateListItemCommentInput = builder.inputType(
  "CreateListItemCommentInput",
  {
    fields: (t) => ({
      message: t.string({ required: true }),
      authorId: t.string({ required: true }),
      listItemId: t.string({ required: true }),
    }),
  }
);

builder.prismaObject("ListItemComment", {
  fields: (t) => ({
    id: t.exposeID("id"),
    createdAt: t.expose("createdAt", {
      type: "Date",
    }),
    updatedAt: t.expose("updateAt", {
      type: "Date",
    }),
    author: t.relation("author"),
    listItem: t.relation("listItem"),
    message: t.exposeString("message"),
  }),
});

builder.queryField("listItemComments", (t) =>
  t.prismaField({
    type: ["ListItemComment"],
    resolve: async (query, root, args, ctx, info) =>
      prisma.listItemComment.findMany({ ...query }),
  })
);

builder.mutationField("createListItemComment", (t) =>
  t.prismaField({
    type: "ListItemComment",
    nullable: true,
    args: {
      input: t.arg({ type: CreateListItemCommentInput, required: true }),
    },
    errors: {
      types: [Error],
    },
    resolve: async (query, _, { input }) => {
      return prisma.listItemComment.create({
        ...query,
        data: {
          message: input.message,
          authorId: input.authorId,
          listItemId: input.listItemId,
        },
      });
    },
  })
);
