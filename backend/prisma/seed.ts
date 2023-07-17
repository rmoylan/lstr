import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.listItem.deleteMany({});
  await prisma.listComment.deleteMany({});
  await prisma.list.deleteMany({});
  await prisma.user.deleteMany({});

  const user = await prisma.user.create({
    data: {
      email: "test@test.com",
      lists: {
        create: [
          {
            name: "list one",
          },
          {
            name: "list two",
          },
        ],
      },
    },
  });

  const list = await prisma.list.create({
    data: {
      authorId: user.id,
      name: "List Three",
    },
  });

  const listComment = await prisma.listComment.create({
    data: {
      userId: user.id,
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

  console.log({ user, list, listComment, listItem });
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

//   import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()
// async function main() {
//   const alice = await prisma.user.upsert({
//     where: { email: 'alice@prisma.io' },
//     update: {},
//     create: {
//       email: 'alice@prisma.io',
//       name: 'Alice',
//       posts: {
//         create: {
//           title: 'Check out Prisma with Next.js',
//           content: 'https://www.prisma.io/nextjs',
//           published: true,
//         },
//       },
//     },
//   })
//   const bob = await prisma.user.upsert({
//     where: { email: 'bob@prisma.io' },
//     update: {},
//     create: {
//       email: 'bob@prisma.io',
//       name: 'Bob',
//       posts: {
//         create: [
//           {
//             title: 'Follow Prisma on Twitter',
//             content: 'https://twitter.com/prisma',
//             published: true,
//           },
//           {
//             title: 'Follow Nexus on Twitter',
//             content: 'https://twitter.com/nexusgql',
//             published: true,
//           },
//         ],
//       },
//     },
//   })
//   console.log({ alice, bob })
// }
// main()
//   .then(async () => {
//     await prisma.$disconnect()
//   })
//   .catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
//   })
