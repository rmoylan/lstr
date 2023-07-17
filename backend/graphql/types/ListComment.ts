import { builder } from "../builder";
import prisma from "../../lib/prisma";

builder.prismaObject("ListComment", {
  fields: (t) => ({
    id: t.exposeID("id"),
    createdAt: t.expose("createdAt", {
      type: "Date",
    }),
    updatedAt: t.expose("updateAt", {
      type: "Date",
    }),
    userId: t.exposeString("userId"),
    listId: t.exposeString("listId"),
    message: t.exposeString("message"),
  }),
});

builder.queryField("comments", (t) =>
  t.prismaField({
    type: ["ListComment"],
    resolve: async (query, root, args, ctx, info) =>
      prisma.listComment.findMany({ ...query }),
  })
);
