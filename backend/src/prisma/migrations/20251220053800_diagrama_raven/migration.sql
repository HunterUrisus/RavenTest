/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Estudiante" (
    "rut" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "fechaNacimiento" TIMESTAMP(3) NOT NULL,
    "anoIngreso" INTEGER NOT NULL,
    "expVideojuegos" TEXT,

    CONSTRAINT "Estudiante_pkey" PRIMARY KEY ("rut")
);

-- CreateTable
CREATE TABLE "Test" (
    "codTest" SERIAL NOT NULL,
    "descripcion" TEXT,
    "tiempoMax" INTEGER,
    "fechaTest" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("codTest")
);

-- CreateTable
CREATE TABLE "Item" (
    "idItem" SERIAL NOT NULL,
    "imagenPregunta" TEXT NOT NULL,
    "imagenRespuesta" TEXT NOT NULL,
    "resCorrecta" INTEGER NOT NULL,
    "dificultad" TEXT,
    "codTest" INTEGER NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("idItem")
);

-- CreateTable
CREATE TABLE "RespuestaItem" (
    "id" SERIAL NOT NULL,
    "rutEstudiante" TEXT NOT NULL,
    "idItem" INTEGER NOT NULL,
    "respuesta" INTEGER NOT NULL,
    "tiempo" INTEGER NOT NULL,
    "esCorrecta" BOOLEAN NOT NULL,
    "fechaIntento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RespuestaItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_codTest_fkey" FOREIGN KEY ("codTest") REFERENCES "Test"("codTest") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RespuestaItem" ADD CONSTRAINT "RespuestaItem_rutEstudiante_fkey" FOREIGN KEY ("rutEstudiante") REFERENCES "Estudiante"("rut") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RespuestaItem" ADD CONSTRAINT "RespuestaItem_idItem_fkey" FOREIGN KEY ("idItem") REFERENCES "Item"("idItem") ON DELETE RESTRICT ON UPDATE CASCADE;
