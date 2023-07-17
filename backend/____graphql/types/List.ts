import { objectType } from "nexus";

export const List = objectType({
  name: 'List',
  definition(t) {
    t.string('id');
    t.string('name');
    t.string('author');
  }
})