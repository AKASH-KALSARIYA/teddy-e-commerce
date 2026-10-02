import React from 'react';
import { useStore } from '../context/StoreContext';
import { productsData } from '../data/products';

const ComparePanel = () => {
  const { compareList, removeCompareItem } = useStore();
  const products = compareList.map(id => productsData.find(p => p.id === id)).filter(Boolean);

  if (products.length === 0) return null;

  return (
    <section className="compare-panel" id="compare">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Compare <span className="highlight">Teddy Styles</span></h2>
          <p className="section-subtitle">Compare up to 4 teddy bears side by side to pick the perfect hug buddy.</p>
        </div>
        <div className="compare-grid">
          {products.map(product => (
            <div key={product.id} className="compare-card">
              <div className="compare-card-top">
                <img src={product.images?.[0] || 'toddy/raj1.jpg'} alt={product.name} />
                <button className="compare-remove" onClick={() => removeCompareItem(product.id)} aria-label={`Remove ${product.name} from compare`}>
                  ×
                </button>
              </div>
              <h3>{product.name}</h3>
              <div className="compare-specs">
                <div><strong>Price:</strong> ₹{product.price}</div>
                <div><strong>Size:</strong> {product.sizes?.join(', ')}</div>
                <div><strong>Colors:</strong> {product.colors?.slice(0, 3).join(', ')}</div>
                <div><strong>Rating:</strong> {product.rating} ★</div>
                <div><strong>Tags:</strong> {product.tags?.slice(0, 3).join(', ')}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComparePanel;
