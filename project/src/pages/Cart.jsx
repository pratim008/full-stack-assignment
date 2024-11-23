import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Trash } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Cart() {
  const { user } = useAuth();
  
  const cartItems = useLiveQuery(
    async () => {
      if (!user) return [];
      
      const items = await db.cart
        .where('userId')
        .equals(user.id)
        .toArray();
      
      const itemsWithDetails = await Promise.all(
        items.map(async (item) => {
          const product = await db.products.get(item.productId);
          return { ...item, product };
        })
      );
      
      return itemsWithDetails;
    },
    [user]
  );

  if (!user) {
    return <Navigate to="/login" />;
  }

  const removeFromCart = async (id) => {
    try {
      await db.cart.delete(id);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;
    try {
      await db.cart.update(id, { quantity });
      toast.success('Quantity updated');
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const total = cartItems?.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  ) || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      {!cartItems?.length ? (
        <p className="text-gray-500 text-center">Your cart is empty.</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-4"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.product.name}
                    </h3>
                    <p className="text-gray-600">
                      ${item.product.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      -
                    </button>
                    <span className="text-gray-700">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-indigo-600">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}