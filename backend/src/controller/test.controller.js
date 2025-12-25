"use strict";
import { prisma } from "../lib/prisma";

export const getAllTests = async (req, res) =>{
    try{
        const tests = await prisma.test.findMany();
        if(tests.length === 0){
            return res.status(404).json({
                message: "No se encontraron tests",
                data: []
            });
        }
        res.json(tests);
    }catch(error){
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const createTest = async (req, res) => {
    try {
        const { descripcion, tiempoMax } = req.body;
        const newTest = await prisma.test.create({
            data: {
                descripcion,
                tiempoMax,
            }
        });
        res.status(201).json(newTest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getTestById = async (req, res) => {
    try {
        const { id } = req.params;
        const test = await prisma.test.findUnique({
            where: { idTest: parseInt(id) },
        });
        res.status(201).json(test);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};