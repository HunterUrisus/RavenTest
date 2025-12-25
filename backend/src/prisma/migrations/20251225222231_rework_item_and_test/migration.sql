/*
  Warnings:

  - You are about to drop the column `imagenPregunta` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `fechaTest` on the `Test` table. All the data in the column will be lost.
  - Added the required column `numero` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serie` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "imagenPregunta",
ADD COLUMN     "numero" INTEGER NOT NULL,
ADD COLUMN     "serie" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Test" DROP COLUMN "fechaTest";
