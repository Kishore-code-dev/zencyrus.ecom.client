import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet } from 'lucide-react';
import { useNavigate } from 'react-router';
import WalletHeader from '@/components/wallet/WalletHeader';
import CurrentBalance from '@/components/wallet/CurrentBalance';
import AddFunds from '@/components/wallet/AddFunds';
import { useAuth } from '@/hooks/use-auth';
import DataGrid from '@/components/data-grid/data-grid';
import Sidebar from '@/components/Sidebar';

export default function WalletPage()
{
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated)
  {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex flex-1 items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
              <Wallet className="h-16 w-16 text-muted-foreground" />
              <h2 className="text-2xl font-bold">Sign In Required</h2>
              <p className="text-muted-foreground">
                Please sign in to manage your wallet.
              </p>
              <Button variant="default" onClick={() => navigate('/login')}>
                Sign In
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          <WalletHeader />
          <div className="grid gap-3.5">
            {/* Balance & Add Funds */}
            <div className="space-y-6">
              {/* Current Balance */}
              <CurrentBalance />
              {/* Add Funds */}
              <AddFunds />
            </div>
            <div className='h-fit w-full grid grid-cols-1 gap-2.5'>
              <DataGrid
                path='wallettopups'
                viewId='68cadf8a-bab1-82b5-4631-37770c720772'
              />
              <DataGrid
                path='wallettopups/approval'
                viewId='973254d7-0d93-86c0-307b-078ce9d1250d'
              />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
