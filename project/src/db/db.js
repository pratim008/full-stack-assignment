import Dexie from 'dexie';

export const db = new Dexie('ecommerceDB');

db.version(1).stores({
  products: '++id, name, price, image, description, createdAt',
  cart: '++id, productId, quantity, userId',
  users: '++id, username, password, isAdmin, createdAt'
});

// Add initial admin user if none exists
db.on('ready', async () => {
  const adminExists = await db.users.where('isAdmin').equals(1).count();
  if (adminExists === 0) {
    await db.users.add({
      username: 'admin',
      password: 'admin123', // In production, use proper password hashing
      isAdmin: 1,
      createdAt: new Date()
    });
  }
});