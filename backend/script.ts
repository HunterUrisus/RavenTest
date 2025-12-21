import { prisma } from './src/lib/prisma'

async function main() {
  // Create a new user with a post
  const user = await prisma.estudiante.create({
    data: {
      rut: "21.350.968-3",
      nombre: "Daniel Valdebenito",
      fechaNacimiento: new Date("2003-07-25"),
      anoIngreso: 2022,
      expVideojuegos: "Alta"
    }
  })
  console.log('Created user:', user)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })