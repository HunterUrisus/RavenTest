/*
  Warnings:

  - You are about to drop the column `fechaIntento` on the `RespuestaItem` table. All the data in the column will be lost.
  - You are about to drop the column `rutEstudiante` on the `RespuestaItem` table. All the data in the column will be lost.
  - Added the required column `idEvaluacion` to the `RespuestaItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RespuestaItem" DROP CONSTRAINT "RespuestaItem_rutEstudiante_fkey";

-- AlterTable
ALTER TABLE "RespuestaItem" DROP COLUMN "fechaIntento",
DROP COLUMN "rutEstudiante",
ADD COLUMN     "estudianteRut" TEXT,
ADD COLUMN     "idEvaluacion" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Evaluacion" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "puntaje" INTEGER NOT NULL,
    "rutEstudiante" TEXT NOT NULL,
    "codTest" INTEGER NOT NULL,

    CONSTRAINT "Evaluacion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RespuestaItem" ADD CONSTRAINT "RespuestaItem_idEvaluacion_fkey" FOREIGN KEY ("idEvaluacion") REFERENCES "Evaluacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RespuestaItem" ADD CONSTRAINT "RespuestaItem_estudianteRut_fkey" FOREIGN KEY ("estudianteRut") REFERENCES "Estudiante"("rut") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluacion" ADD CONSTRAINT "Evaluacion_rutEstudiante_fkey" FOREIGN KEY ("rutEstudiante") REFERENCES "Estudiante"("rut") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluacion" ADD CONSTRAINT "Evaluacion_codTest_fkey" FOREIGN KEY ("codTest") REFERENCES "Test"("codTest") ON DELETE RESTRICT ON UPDATE CASCADE;
