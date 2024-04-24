import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// initialize Prisma Client

const prisma = new PrismaClient();

async function main() {
  // create two dummy articles

  const post1 = await prisma.article.upsert({
    where: { title: 'Prisma Adds Support for MongoDB' },

    update: {},

    create: {
      title: 'Prisma Adds Support for MongoDB',

      body: 'Support for MongoDB has been one of the most requested features since the initial release of...',

      description:
        "We are excited to share that today's Prisma ORM release adds stable support for MongoDB!",

      published: false,
    },
  });

  const post2 = await prisma.article.upsert({
    where: { title: "What's new in Prisma? (Q1/22)" },

    update: {},

    create: {
      title: "What's new in Prisma? (Q1/22)",

      body: 'Our engineers have been working hard, issuing new releases with many improvements...',

      description:
        'Learn about everything in the Prisma ecosystem and community from January to March 2022.',

      published: true,
    },
  });

  const user1 = await prisma.user.upsert({
    where: { phone: '069265958' },

    update: {},

    create: {
      name: 'Suos Phearith',
      phone: '069265958',
      password: await bcrypt.hash('069265958', 10),
      role: 'admin',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { phone: '0963180249' },

    update: {},

    create: {
      name: 'Ven Dara',
      phone: '0963180249',
      password: await bcrypt.hash('0963180249', 10),
      role: 'manager',
    },
  });

  const user3 = await prisma.user.upsert({
    where: { phone: '070707635' },

    update: {},

    create: {
      name: 'Van Chansethy',
      phone: '070707635',
      password: await bcrypt.hash('070707635', 10),
      role: 'analyst',
    },
  });

  const user4 = await prisma.user.upsert({
    where: { phone: '093696952' },

    update: {},

    create: {
      name: 'Som Bunheng',
      phone: '093696952',
      password: await bcrypt.hash('093696952', 10),
      role: 'user',
    },
  });

  console.log({ post1, post2, user1, user2, user3, user4 });
}

// execute the main function

main()
  .catch((e) => {
    console.error(e);

    process.exit(1);
  })

  .finally(async () => {
    // close Prisma Client at the end

    await prisma.$disconnect();
  });
