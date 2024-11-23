import { db } from './db';

export async function seedInitialData() {
  const productsCount = await db.products.count();
  
  if (productsCount === 0) {
    const sampleProducts = [
      {
        name: "Premium Wireless Headphones",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60",
        description: "High-quality wireless headphones with noise cancellation",
        createdAt: new Date()
      },
      {
        name: "Smart Watch Series X",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=60",
        description: "Advanced smartwatch with health tracking features",
        createdAt: new Date()
      },
      {
        name: "4K Ultra HD Camera",
        price: 599.99,
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=60",
        description: "Professional-grade camera for stunning photography",
        createdAt: new Date()
      }
    ];

    await db.products.bulkAdd(sampleProducts);
  }
}