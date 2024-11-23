import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const products = useLiveQuery(() => db.products.toArray());

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Products</h1>
      
      {products?.length === 0 ? (
        <p className="text-gray-500 text-center">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}