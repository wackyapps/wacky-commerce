"use client";

import React, { useState } from "react";
import StockAvailabillity from "./StockAvailabillity";
import SingleProductDynamicFields from "./SingleProductDynamicFields";
import AddToWishlistBtn from "./AddToWishlistBtn";

const ProductDetailsVariantSelection: React.FC<{ product: Product }> = ({
  product,
}) => {
  const [selectedVariant, setselectedVariant] = useState<ProductVariant>(
    product.variants[0]
  );
  return (
    <div className="flex flex-col items-stretch gap-y-3">
      <div className="flex flex-wrap gap-4">
        {product.variants.map((variant, index) => (
          <button
            key={index}
            onClick={() => setselectedVariant(variant)}
            className={`px-4 mb-2 py-2 bg-white text-sm rounded-full ${
              selectedVariant.id === variant.id ? " border" : ""
            }`}
          >
            {variant.name}
          </button>
        ))}
      </div>
      <p className="text-xl font-semibold">${selectedVariant?.price}</p>
      <StockAvailabillity stock={94} inStock={selectedVariant?.inStock} />
      <SingleProductDynamicFields
        product={product}
        selectedVariant={selectedVariant}
      />
      {/* <AddToWishlistBtn product={product} slug={params.productSlug} /> */}
    </div>
  );
};

export default ProductDetailsVariantSelection;
