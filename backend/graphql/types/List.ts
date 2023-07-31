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
    items: t.field({ type: [UpdateListItemInput] }),
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
    resolve: async (
      query,
      root,
      { input: { id, items, ...rest } },
      ctx,
      info
    ) => {
      const list = await prisma.list.findUnique({ where: { id } });
      if (!list) throw Error(`Could not find the list with id ${id}`);

      const listItems = await prisma.listItem.findMany({
        where: { listId: list.id },
      });

      const listItemsIds = listItems.map((item) => item.id);

      // prisma.$transaction(async (prisma) => {
      //   items?.forEach(async (item) => {
      //     try {
      //       await prisma.listItem.upsert({
      //         where: {
      //           id,
      //         },
      //         update: {
      //           ...item,
      //         },
      //         create: {
      //           ...item,
      //         },
      //       });
      //     }
      //   });
      // });
      // if (items) {
      //   prisma.$transaction(
      //     // items.map(async (item) => {
      //     //   const itemId = item.id || null;
      //     //   const itemExists = itemId ? listItemsIds.includes(itemId) : "";
      //     //   if (itemId && itemExists)
      //     //     return await prisma.listItem.update({
      //     //       where: {
      //     //         id: itemId,
      //     //       },
      //     //       data: {
      //     //         ...item,
      //     //       },
      //     //     });

      //     //   return await prisma.listItem.create({
      //     //     data: {
      //     //       listId: list.id,
      //     //       ...item,
      //     //     },
      //     //   });
      //     items.map((item) => {
      //       return prisma.listItem.upsert({
      //         where: { id: item.id  },
      //         update: {
      //           ...item,
      //           // listId: list.id,
      //         },
      //         create: {
      //           ...item,
      //           listId: list.id,
      //         },
      //       });
      //     })
      //   );
      //   // );
      //   // prisma.$transaction(async (prisma) => {
      //   //   try {
      //   //     // for (let i = 0; i < items.length; i++) {
      //   //       for (let item of items) {
      //   //       // const item = items[i];
      //   //       console.log(
      //   //         "🚀 ~ file: List.ts:152 ~ prisma.$transaction ~ item:",
      //   //         { item }
      //   //       );
      //   //       await prisma.listItem.upsert({
      //   //         where: { id: item.id },
      //   //         update: {
      //   //           ...item,
      //   //         },
      //   //         create: {
      //   //           ...item,
      //   //         },
      //   //       });
      //   //     }
      //   //   } catch {
      //   //     throw new Error("Could not update items");
      //   //   }
      //   // });
      // }

      return prisma.list.update({
        ...query,
        where: {
          id,
        },
        data: {
          name: rest.name ? rest.name : list.name,
          items: {
            upsert: items?.map((item) => ({
              where: {
                id: item.id || "",
              },
              create: {
                ...item,
              },
              update: {
                ...item,
              },
            })),
            // connectOrCreate: items?.map((item) => ({
            //   where: {
            //     id: item.id || "",
            //   },
            //   create: {
            //     ...item,
            //   },
            // })),
          },
        },
      });
    },
    // resolve: (query, _, { input}) =>
    // resolve: (query, root, {input, ...rest}, ctx, info) => {
    //   console.log({query, root, ctx, info});
    //   return prisma.list.update({
    //     ...query,
    //     where: {
    //       id: input.id ,
    //     },
    //     data: {
    //       name: input.name? input.name : '',
    //       // players: {
    //       //   create: input.players.map((player) => ({
    //       //     name: player.name,
    //       //     number: player.number,
    //       //   })),
    //       // },
    //     },
    //   }),

    // }
  }),
}));

export { CreateListInput };
