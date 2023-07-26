import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.listItem.deleteMany({});
  await prisma.listComment.deleteMany({});
  await prisma.vote.deleteMany({});
  await prisma.list.deleteMany({});
  await prisma.user.deleteMany({});

  const user = await prisma.user.create({
    data: {
      email: "test@test.com",
    },
  });

  const scale = await prisma.scale.create({
    data: {
      name: "precise",
      min: 0,
      max: 1,
    },
  });

  const list = await prisma.list.create({
    data: {
      authorId: user.id,
      name: "List Three",
      scaleId: scale.id,
    },
  });

  const listComment = await prisma.listComment.create({
    data: {
      authorId: user.id,
      message: "List three is good",
      listId: list.id,
    },
  });

  const listItem = await prisma.listItem.create({
    data: {
      name: "list item 1",
      listId: list.id,
      rating: 0.8,
    },
  });

  const vote = await prisma.vote.create({
    data: {
      listId: list.id,
      value: 1,
      authorId: user.id,
    },
  });

  console.log({ user, scale, list, listComment, listItem, vote });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
