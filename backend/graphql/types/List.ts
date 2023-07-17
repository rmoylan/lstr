import { builder } from "../builder";
import prisma from "../../lib/prisma";

builder.prismaObject("List", {
  fields: (t) => ({
    id: t.exposeID("id"),
    createdAt: t.field({
      type: "Date",
      resolve: () => new Date(),
    }),
    updatedAt: t.field({
      type: "Date",
      resolve: () => new Date(),
    }),
    name: t.exposeString("name"),
    author: t.relation("author"),
    comments: t.relation("comments"),
    items: t.relation("items"),
    // authorId: t.exposeString('authorId'),

    // author: t.relation('author', {
    //   args: {
    //     id: t.arg.string(),
    //   },
    //   // Define custom query options that are applied when
    //   // loading the post relation
    //   query: (args, context) => ({

    //     // orderBy: {
    //     //   createdAt: args.oldestFirst ? 'asc' : 'desc',
    //     // },
    //   }),
    // }),
  }),
});

builder.queryField("list", (t) =>
  t.prismaField({
    type: ["List"],
    resolve: async (query, root, args, ctx, info) =>
      prisma.list.findMany({ ...query }),
  })
);
