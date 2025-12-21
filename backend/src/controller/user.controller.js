"use strict";
import { prisma } from "../lib/prisma";

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.estudiante.findMany();
    if (users.length === 0) {
      return res.status(404).json({
        message: "No se encontraron usuarios",
        data: []
      });
    }
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export async function getUserById(req, res){
  try {
    const rutUser = req.query.rut;
    console.log(rutUser);
    if (!rutUser) {
      res.status(400).json({
        message: "El parámetro 'rut' es requerido.",
        data: null
      });
      return;
    }

    // Normalizar RUT: quitar puntos y guión, poner DV en mayúscula
    const normalizedRut = rutUser.replace(/[.\-]/g, "").toUpperCase();

    // Buscar con Prisma usando la clave primaria 'rut'
    const user = await prisma.estudiante.findUnique({
      where: { rut: normalizedRut }
    });

    if(!user){
      res.status(404).json({
        message: "Usuario no encontrado",
        data: null
      });
      return;
    }
    res.status(200).json({
            message: "Usuario encontrado!",
            data: user
        })
    // Retornar usuario encontrado
    res.json(user);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
    console.log(rutUser);
  }
};

export const createUser = async (req, res) => {
  const { rut, nombre, fechaNacimiento, anoIngreso, expVideojuegos } = req.body;
  try {
    const newUser = await prisma.estudiante.create({
      data: {
        rut,
        nombre,
        fechaNacimiento: new Date(fechaNacimiento),//esto es para convertir el string a date
        anoIngreso,
        expVideojuegos,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export async function deleteUser(req, res) {
  try {
      const rutUser = req.query.rut;
      if (!rutUser) {
        res.status(400).json({
          message: "El parámetro 'rut' es requerido.",
          data: null
        });
        return;
      }

    // Normalizar RUT: quitar puntos y guión, poner DV en mayúscula
    const normalizedRut = rutUser.replace(/[.\-]/g, "").toUpperCase();

    // Buscar con Prisma usando la clave primaria 'rut'
    const user = await prisma.estudiante.delete({
      where: { rut: normalizedRut }
    });
    
    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
        data: null
      });
    }

    res.status(200).json({
      message: "Usuario eliminado exitosamente!",
      data: user
    });

  } catch (error) {
    console.log("Error en user.controller.js -> deleteUser(): ", error);
    res.status(500).json({ message: error.message });
  }
};


export async function updateUser(req, res) {
  try {
    const rutUser = req.query.rut;
    const { nombre, fechaNacimiento, anoIngreso, expVideojuegos } = req.body;
    if (!rutUser) {
      res.status(400).json({
        message: "El parámetro 'rut' es requerido.",
        data: null
      });
      return;
    }
    // Normalizar RUT: quitar puntos y guión, poner DV en mayúscula
    const normalizedRut = rutUser.replace(/[.\-]/g, "").toUpperCase();
    const updatedUser = await prisma.estudiante.update({
      where: { rut: normalizedRut },
      data: {
        nombre,
        fechaNacimiento: new Date(fechaNacimiento),
        anoIngreso,
        expVideojuegos,
      },
    });
    res.status(200).json({
      message: "Usuario actualizado exitosamente!",
      data: updatedUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};