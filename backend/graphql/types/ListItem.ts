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
    id: t.string({ required: true }),
    name: t.string(),
    rating: t.float(),
  }),
});

const DeleteListItemInput = builder.inputType("DeleteListItemInput", {
  fields: (t) => ({
    id: t.string({ required: true }),
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

builder.mutationFields((t) => ({
  updateListItem: t.prismaField({
    type: "ListItem",
    nullable: true,
    args: {
      input: t.arg({ type: UpdateListItemInput, required: true }),
    },
    errors: {
      types: [Error],
    },
    resolve: async (
      query,
      root,
      { input: { id, name, rating } },
      ctx,
      info
    ) => {
      const listItem = await prisma.listItem.findUnique({ where: { id } });
      if (!listItem) throw Error(`Could not find the listItem with id ${id}`);

      return prisma.listItem.update({
        ...query,
        where: {
          id,
        },
        data: {
          name: name ? name : listItem.name,
          rating: rating ? rating : listItem.rating,
        },
      });
    },
  }),
  deleteListItem: t.prismaField({
    type: "ListItem",
    nullable: true,
    args: {
      input: t.arg({ type: DeleteListItemInput, required: true }),
    },
    resolve: async (query, root, { input: { id } }, ctx, info) => {
      const listItem = await prisma.listItem.findUnique({ where: { id } });
      if (!listItem) throw Error(`Could not find the listItem with id ${id}`);

      return prisma.listItem.delete({
        ...query,
        where: {
          id,
        },
      });
    },
  }),
}));
export { CreateListItemInput, UpdateListItemInput };
