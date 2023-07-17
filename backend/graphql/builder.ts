import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import { DateResolver } from "graphql-scalars";
import prisma from "../lib/prisma";

export enum Role {
  GOD,
  ADMIN,
  USER,
}

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Scalars: {
    Date: {
      Input: Date;
      Output: Date;
    };
  };
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
  },
});

builder.enumType(Role, {
  name: "Role",
});

builder.addScalarType("Date", DateResolver, {});

builder.queryType({
  // fields: (t) => ({
  //   ok: t.boolean({
  //     resolve: () => true,
  //   }),
  // }),
});
