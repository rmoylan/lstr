import { builder } from "../builder";
import prisma from "../../lib/prisma";

builder.prismaObject("Scale", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    max: t.exposeFloat("max"),
    min: t.exposeFloat("min"),
    type: t.exposeString("type"),
  }),
});

builder.queryField("Scale", (t) =>
  t.prismaField({
    type: ["Scale"],
    resolve: async (query, root, args, ctx, info) =>
      prisma.scale.findMany({ ...query }),
  })
);
