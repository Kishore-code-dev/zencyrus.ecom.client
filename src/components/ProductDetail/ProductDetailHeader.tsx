
import { Button } from '../ui/button'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router';


const ProductDetailHeader = () =>
{
  const navigate = useNavigate();
  return (
    <Button
      variant="ghost"
      className="mb-6"
      onClick={() => navigate('/catalog')}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back to Catalog
    </Button>
  )
}

export default ProductDetailHeader