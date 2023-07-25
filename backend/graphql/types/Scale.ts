import { builder } from "../builder";
import prisma from "../../lib/prisma";

const CreateScaleInput = builder.inputType("CreateScaleInput", {
  fields: (t) => ({
    name: t.string({ required: true }),
    max: t.float({ required: true }),
    min: t.float({ required: true }),
  }),
});

builder.prismaObject("Scale", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    max: t.exposeFloat("max"),
    min: t.exposeFloat("min"),
    type: t.exposeString("type"),
  }),
});

builder.queryField("scale", (t) =>
  t.prismaField({
    type: ["Scale"],
    resolve: async (query, root, args, ctx, info) =>
      prisma.scale.findMany({ ...query }),
  })
);

builder.mutationField("createScale", (t) =>
  t.prismaField({
    type: "Scale",
    nullable: true,
    args: {
      input: t.arg({ type: CreateScaleInput, required: true }),
    },
    errors: {
      types: [Error],
    },
    resolve: async (query, _, { input }) => {
      return prisma.scale.create({
        ...query,
        data: {
          name: input.name,
          max: input.max,
          min: input.min,
        },
      });
    },
  })
);

export { CreateScaleInput };
