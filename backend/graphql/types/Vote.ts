import { builder } from "../builder";
import prisma from "../../lib/prisma";

builder.prismaObject("Vote", {
  fields: (t) => ({
    id: t.exposeID("id"),
    list: t.relation("list"),
    author: t.relation("author"),
  }),
});

builder.queryField("Vote", (t) =>
  t.prismaField({
    type: ["Vote"],
    resolve: async (query, root, args, ctx, info) =>
      prisma.vote.findMany({ ...query }),
  })
);
