import { builder } from "../builder";
import prisma from "../../lib/prisma";

builder.prismaObject("ListItem", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    list: t.relation("list"),
    rating: t.exposeFloat("rating"),
    comments: t.relation("listItemComments"),
  }),
});

builder.queryField("ListItem", (t) =>
  t.prismaField({
    type: ["ListItem"],
    resolve: async (query, root, args, ctx, info) =>
      prisma.listItem.findMany({ ...query }),
  })
);
