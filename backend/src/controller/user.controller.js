"use strict";
import { prisma } from "../lib/prisma";

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.estudiante.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};