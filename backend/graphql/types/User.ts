import { builder } from "../builder";
import prisma from "../../lib/prisma";

const CreateUserInput = builder.inputType("CreateUserInput", {
  fields: (t) => ({
    email: t.string({ required: true }),
  }),
});

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
    listComments: t.relation("listComments"),
    listItemComments: t.relation("listItemComments"),
    votes: t.relation("votes"),
  }),
});

builder.queryField("users", (t) =>
  t.prismaField({
    type: ["User"],
    resolve: async (query, root, args, ctx, info) =>
      prisma.user.findMany({ ...query }),
  })
);

builder.mutationField("createUser", (t) =>
  t.prismaField({
    type: "User",
    nullable: true,
    args: {
      input: t.arg({ type: CreateUserInput, required: true }),
    },
    errors: {
      types: [Error],
    },
    resolve: async (query, _, { input }) => {
      const user = await prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (user) throw new Error("User already exists");

      return prisma.user.create({
        ...query,
        data: {
          email: input.email,
        },
      });
    },
  })
);

export { CreateUserInput };
