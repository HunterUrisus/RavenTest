"use strict";
import { prisma } from "../lib/prisma";

async function seedTestPrueba() {
    await prisma.test.create({
        data: {
            descripcion: "Test previo entrenamiento",
            tiempoMax: 30,
        }
    });

    await prisma.test.create({
        data: {
            descripcion: "Test post entrenamiento",
            tiempoMax: 30,
        }
    });

    await prisma.test.create({
        data: {
            descripcion: "Test de prueba",
            tiempoMax: 30,
        }
    });
}

async function seedItems() {
    const respuestasRaven = [
  // SERIE A (1-12)
  { serie: 'A', numero: 1, correcta: 4, cantOpciones: 6 },
  { serie: 'A', numero: 2, correcta: 5, cantOpciones: 6 },
  { serie: 'A', numero: 3, correcta: 1, cantOpciones: 6 },
  { serie: 'A', numero: 4, correcta: 2, cantOpciones: 6 },
  { serie: 'A', numero: 5, correcta: 6, cantOpciones: 6 },
  { serie: 'A', numero: 6, correcta: 3, cantOpciones: 6 },
  { serie: 'A', numero: 7, correcta: 6, cantOpciones: 6 },
  { serie: 'A', numero: 8, correcta: 2, cantOpciones: 6 },
  { serie: 'A', numero: 9, correcta: 1, cantOpciones: 6 },
  { serie: 'A', numero: 10, correcta: 3, cantOpciones: 6 },
  { serie: 'A', numero: 11, correcta: 4, cantOpciones: 6 },
  { serie: 'A', numero: 12, correcta: 4, cantOpciones: 6 },

  // SERIE B (13-24)
  { serie: 'B', numero: 1, correcta: 2, cantOpciones: 6 },
  { serie: 'B', numero: 2, correcta: 6, cantOpciones: 6 },
  { serie: 'B', numero: 3, correcta: 1, cantOpciones: 6 },
  { serie: 'B', numero: 4, correcta: 2, cantOpciones: 6 },
  { serie: 'B', numero: 5, correcta: 1, cantOpciones: 6 },
  { serie: 'B', numero: 6, correcta: 3, cantOpciones: 6 },
  { serie: 'B', numero: 7, correcta: 5, cantOpciones: 6 },
  { serie: 'B', numero: 8, correcta: 6, cantOpciones: 6 },
  { serie: 'B', numero: 9, correcta: 4, cantOpciones: 6 },
  { serie: 'B', numero: 10, correcta: 3, cantOpciones: 6 },
  { serie: 'B', numero: 11, correcta: 4, cantOpciones: 6 },
  { serie: 'B', numero: 12, correcta: 5, cantOpciones: 6 },

  // SERIE C (25-36)
  { serie: 'C', numero: 1, correcta: 8, cantOpciones: 8 },
  { serie: 'C', numero: 2, correcta: 2, cantOpciones: 8 },
  { serie: 'C', numero: 3, correcta: 3, cantOpciones: 8 },
  { serie: 'C', numero: 4, correcta: 8, cantOpciones: 8 },
  { serie: 'C', numero: 5, correcta: 7, cantOpciones: 8 },
  { serie: 'C', numero: 6, correcta: 4, cantOpciones: 8 },
  { serie: 'C', numero: 7, correcta: 5, cantOpciones: 8 },
  { serie: 'C', numero: 8, correcta: 1, cantOpciones: 8 },
  { serie: 'C', numero: 9, correcta: 7, cantOpciones: 8 },
  { serie: 'C', numero: 10, correcta: 6, cantOpciones: 8 },
  { serie: 'C', numero: 11, correcta: 1, cantOpciones: 8 },
  { serie: 'C', numero: 12, correcta: 2, cantOpciones: 8 },

  // SERIE D (37-48)
  { serie: 'D', numero: 1, correcta: 3, cantOpciones: 8 },
  { serie: 'D', numero: 2, correcta: 4, cantOpciones: 8 },
  { serie: 'D', numero: 3, correcta: 3, cantOpciones: 8 },
  { serie: 'D', numero: 4, correcta: 7, cantOpciones: 8 },
  { serie: 'D', numero: 5, correcta: 8, cantOpciones: 8 },
  { serie: 'D', numero: 6, correcta: 6, cantOpciones: 8 },
  { serie: 'D', numero: 7, correcta: 5, cantOpciones: 8 },
  { serie: 'D', numero: 8, correcta: 4, cantOpciones: 8 },
  { serie: 'D', numero: 9, correcta: 1, cantOpciones: 8 },
  { serie: 'D', numero: 10, correcta: 2, cantOpciones: 8 },
  { serie: 'D', numero: 11, correcta: 5, cantOpciones: 8 },
  { serie: 'D', numero: 12, correcta: 6, cantOpciones: 8 },

  // SERIE E (49-60)
  { serie: 'E', numero: 1, correcta: 7, cantOpciones: 8 },
  { serie: 'E', numero: 2, correcta: 6, cantOpciones: 8 },
  { serie: 'E', numero: 3, correcta: 8, cantOpciones: 8 },
  { serie: 'E', numero: 4, correcta: 2, cantOpciones: 8 },
  { serie: 'E', numero: 5, correcta: 1, cantOpciones: 8 },
  { serie: 'E', numero: 6, correcta: 5, cantOpciones: 8 },
  { serie: 'E', numero: 7, correcta: 2, cantOpciones: 8 },
  { serie: 'E', numero: 8, correcta: 4, cantOpciones: 8 },
  { serie: 'E', numero: 9, correcta: 1, cantOpciones: 8 },
  { serie: 'E', numero: 10, correcta: 6, cantOpciones: 8 },
  { serie: 'E', numero: 11, correcta: 3, cantOpciones: 8 },
  { serie: 'E', numero: 12, correcta: 5, cantOpciones: 8 }
];
    for (let i = 1; i <= 60; i++) { 
        const itemData = respuestasRaven[i - 1];
        const codTest = i%2? 2 : 1; // Alternar entre test 1 y 2
        await prisma.item.create({
            data: {
                serie: itemData.serie,
                numero: itemData.numero,
                resCorrecta: itemData.correcta,
                dificultad: null,
                cantOpciones: itemData.cantOpciones,
                codTest,
            }
        });
    }

    for (let i = 0; i < 5; i++) { 
        const itemData = respuestasRaven[i];
        await prisma.item.create({
            data: {
                serie: itemData.serie,
                numero: itemData.numero,
                resCorrecta: itemData.correcta,
                dificultad: null,
                cantOpciones: itemData.cantOpciones,
                codTest: 3,
            }
        });
    }
}

export async function startSeed() {
    const tests = await prisma.test.findMany();
    if (tests.length === 0) { 
        console.log("Iniciando seeding de tests...");
        await seedTestPrueba();
    }

    const items = await prisma.item.findMany();
    if (items.length === 0) {
        console.log("Iniciando seeding de items...");
        await seedItems();
    }
}