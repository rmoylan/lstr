import { builder } from "../builder";
import prisma from "../../lib/prisma";
import { CreateListItemInput, UpdateListItemInput } from "./ListItem";

const CreateListInput = builder.inputType("CreateListInput", {
  fields: (t) => ({
    name: t.string({ required: true }),
    authorId: t.string({ required: true }),
    scaleId: t.string({ required: true }),
    items: t.field({ type: [CreateListItemInput] }),
  }),
});

const UpdateListInput = builder.inputType("UpdateListInput", {
  fields: (t) => ({
    id: t.string({ required: true }),
    name: t.string(),
    authorId: t.string(),
    scaleId: t.string(),
    // items: t.field({
    //   type: [UpdateListItemInput],
    // }),
  }),
});

const QueryIdInput = builder.inputType("queryIdInput", {
  fields: (t) => ({
    id: t.string({ required: true }),
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
  list: t.prismaField({
    type: "List",
    errors: {
      types: [Error],
    },
    args: {
      input: t.arg({ type: QueryIdInput, required: true }),
    },
    resolve: async (query, root, { input: { id } }, ctx, info) => {
      if (!id) throw new Error("Please provide an id");

      const list = await prisma.list.findUnique({
        ...query,
        where: {
          id: id,
        },
      });

      if (!list) throw new Error("Could not find list");

      return list;
    },
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
    resolve: async (query, _, { input: { authorId } }) => {
      if (!authorId) throw new Error("Please provide an authorId");

      return await prisma.list.findMany({
        ...query,
        where: {
          authorId,
        },
      });
    },
  }),
}));

builder.mutationFields((t) => ({
  createList: t.prismaField({
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
  }),
  updateList: t.prismaField({
    type: "List",
    nullable: true,
    args: {
      input: t.arg({ type: UpdateListInput, required: true }),
    },
    errors: {
      types: [Error],
    },
    resolve: async (query, root, { input: { id, name } }, ctx, info) => {
      const list = await prisma.list.findUnique({ where: { id } });
      if (!list) throw Error(`Could not find the list with id ${id}`);

      return prisma.list.update({
        ...query,
        where: {
          id,
        },
        data: {
          name: name ? name : list.name,
          // items: {
          //   // TODO: look into using different inputs for upsert when describing create and update
          //   // @ts-ignore
          //   upsert: items?.map((item) => ({
          //     where: {
          //       id: item.id ?? undefined,
          //     },
          //     update: {
          //       ...item,
          //     },
          //     create: {
          //       ...item,
          //     },
          //   })),
          // },
        },
      });
    },
  }),
}));

export { CreateListInput };
