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

const QueryUserListsInput = builder.inputType("QueryUserListsInput", {
  fields: (t) => ({
    authorId: t.string({ required: true }),
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

builder.queryFields((t) => ({
  allLists: t.prismaField({
    type: ["List"],
    resolve: async (query, root, args, ctx, info) =>
      prisma.list.findMany({ ...query }),
  }),
  userLists: t.prismaField({
    type: ["List"],
    args: {
      input: t.arg({ type: QueryUserListsInput, required: true }),
    },
    nullable: true,
    errors: {
      types: [Error],
    },
    resolve: (query, _, { input: { authorId } }) => {
      if (!authorId) throw new Error("Please provide an authorId");

      return prisma.list.findMany({
        ...query,
        where: {
          authorId,
        },
      });
    },
  }),
}));

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
