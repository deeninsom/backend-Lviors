import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import * as bcrypt from 'bcryptjs';

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const user = await prisma.user.upsert({
    create: {
      email: 'admin@gmail.com',
      username: 'admin',
      password: hashedPassword
    },
    where: { email: 'admin@gmail.com' },
    update: {}
  })

  await prisma.post.upsert({
    create: {
      caption: 'lorem dipsum',
      tags: 'lorem',
      likes: 0,
      author_id: user.id
    },
    where: {
      id: ''
    },
    update: {}
  })

}

main()
  .then(async () => {
    console.log('Migration seed successfully')
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })