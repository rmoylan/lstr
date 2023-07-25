import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import ErrorsPlugin from "@pothos/plugin-errors";
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
  plugins: [PrismaPlugin, ErrorsPlugin],
  prisma: {
    client: prisma,
  },
  errorOptions: {
    defaultTypes: [],
  },
});

builder.enumType(Role, {
  name: "Role",
});

builder.addScalarType("Date", DateResolver, {});

builder.queryType({});

builder.mutationType();
