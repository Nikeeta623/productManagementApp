import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/role.middleware";

const prisma = new PrismaClient();
const router = Router();

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err });
  }
});

router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product", error: err });
  }
});

router.post("/", verifyToken, isAdmin, async (req: Request, res: Response) => {
  const { name, description, category, price, rating } = req.body;

  try {
    const newProduct = await prisma.product.create({
      data: { name, description, category, price, rating },
    });

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: "Error creating product", error: err });
  }
});

router.put("/:id", verifyToken, isAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, category, price, rating } = req.body;

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { name, description, category, price, rating },
    });

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: "Error updating product", error: err });
  }
});

router.delete("/:id", verifyToken, isAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.product.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Error deleting product", error: err });
  }
});

export default router;
