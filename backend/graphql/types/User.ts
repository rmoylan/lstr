import { builder } from "../builder";
import prisma from "../../lib/prisma";
// import { PrismaClient } from "../prisma/client";

// export const db = new PrismaClient();

builder.prismaObject("User", {
  fields: (t) => ({
    id: t.exposeID("id"),
    memberNumber: t.exposeInt("memberNumber"),
    createdAt: t.expose("createdAt", {
      type: "Date",
    }),
    updatedAt: t.expose("updateAt", {
      type: "Date",
    }),
    email: t.exposeString("email"),
    role: t.exposeString("role"),
    lists: t.relation("lists"),
    // lists: t.relation("lists", {
    //   args: {
    //     oldestFirst: t.arg.boolean(),
    //   },
    //   // Define custom query options that are applied when
    //   // loading the post relation
    //   query: (args, context) => ({
    //     orderBy: {
    //       createdAt: args.oldestFirst ? "asc" : "desc",
    //     },
    //   }),
    // }),

    // comments:
    // votes:
    // setting:
    // settingId
  }),
});

builder.queryField("users", (t) =>
  t.prismaField({
    type: ["User"],
    resolve: async (query, root, args, ctx, info) =>
      prisma.user.findMany({ ...query }),
  })
);

// builder.queryType({
//   fields: (t) => ({
//     user: t.prismaField({
//       type: "User",
//       nullable: true,
//       args: {
//         id: t.arg.id({ required: true }),
//       },
//       resolve: (query, root, args) =>
//         db.user.findUnique({
//           ...query,
//           where: { id: Number.parseInt(String(args.id), 10) },
//         }),
//     }),
//   }),
// });
