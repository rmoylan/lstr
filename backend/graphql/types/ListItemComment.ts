import { builder } from "../builder";
import prisma from "../../lib/prisma";

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
