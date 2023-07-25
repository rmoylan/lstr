import { builder } from "../builder";
import prisma from "../../lib/prisma";
import { CreateListItemInput } from "./ListItem";

const CreateListInput = builder.inputType("CreateListInput", {
  fields: (t) => ({
    name: t.string({ required: true }),
    authorId: t.string({ required: true }),
    scaleId: t.string({ required: true }),
    items: t.field({ type: [CreateListItemInput] }),
  }),
});

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
    scale: t.relation("scale"),
  }),
});

builder.queryField("list", (t) =>
  t.prismaField({
    type: ["List"],
    resolve: async (query, root, args, ctx, info) =>
      prisma.list.findMany({ ...query }),
  })
);

builder.mutationField("createList", (t) =>
  t.prismaField({
    type: "List",
    nullable: true,
    args: {
      input: t.arg({ type: CreateListInput, required: true }),
    },
    errors: {
      types: [Error],
    },
    resolve: async (query, _, { input }) => {
      return prisma.list.create({
        ...query,
        data: {
          name: input.name,
          authorId: input.authorId,
          scaleId: input.scaleId,
          items: {
            create: input.items
              ? input.items.map((item) => ({
                  name: item.name,
                }))
              : [],
          },
        },
      });
    },
  })
);

export { CreateListInput };
