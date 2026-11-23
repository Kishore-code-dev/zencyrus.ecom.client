const ProductDescription = ({ product }: any) =>
{
  return (
    <div className="w-full max-w-3xl text-wrap" style={{ textWrap: "wrap", textWrapMode: "wrap" }}>
      <h1 className="mt-2 font-display text-3xl font-bold">{product.name}</h1>
      <p className="mt-3 text-muted-foreground">
        <span className="font-bold text-destructive text-xl mr-2.5">18% GST Inclusive</span>
        <span dangerouslySetInnerHTML={{ __html: product.description ?? "" }} />
      </p>
      {/* <p className="mt-3 text-lg font-semibold">Turnaround {product.turnAroundDays}</p> */}
    </div>
  )
}

export default ProductDescription