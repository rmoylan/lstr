import { builder } from "../builder";
import prisma from "../../lib/prisma";

const CreateListItemInput = builder.inputType("CreateListItemInput", {
  fields: (t) => ({
    name: t.string({ required: true }),
    rating: t.float(),
  }),
});

const UpdateListItemInput = builder.inputType("UpdateListItemInput", {
  fields: (t) => ({
    id: t.string(),
    name: t.string({ required: true }),
    rating: t.float({ required: true }),
  }),
});

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

export { CreateListItemInput, UpdateListItemInput };
