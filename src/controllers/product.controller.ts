export const createProduct = async (req: Request, res: Response) => {
    const { name, description, category, price, rating } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        description,
        category,
        price,
        rating,
        userId: req.user.id,
      },
    });
    res.json(product);
  };
  
  