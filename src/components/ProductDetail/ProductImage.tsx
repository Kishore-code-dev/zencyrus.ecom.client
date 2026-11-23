

const ProductImage = ({ product }: any) =>
{
  return (
    <div className="space-y-4">
      <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-secondary shadow-medium">
        <img
          loading="lazy"
          decoding="async"
          src={product.productImage.label}
          alt={product.productImage.value}
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default ProductImage;
