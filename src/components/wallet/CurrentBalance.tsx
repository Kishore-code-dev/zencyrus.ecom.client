
import { useEffect, useState, useTransition } from 'react';
import { Card, CardHeader, CardTitle } from '../ui/card'
import type { WalletInfo } from '@/types/wallet';
import { useApiAction } from '@/hooks/use-api-action';
import { api } from '@/config/api';
import { AxiosError } from 'axios';
import { demoWalletBalance } from '@/data/demo-data';

const CurrentBalance = () =>
{
  const { apiActionAsync } = useApiAction()
  const [loading, startTransition] = useTransition()
  const [walletInfo, setWalletInfo] = useState<WalletInfo>({ currentBalance: demoWalletBalance, totalAddedFund: 0, totalSpendFund: 0 })

  useEffect(() =>
  {
    startTransition(async () =>
    {
      try
      {
        const response = await api.get(`wallet/info`)
        if (response.status == 200 && response.data)
        {
          setWalletInfo(response.data)
        }
      } catch (error)
      {
        // Backend unreachable — use demo wallet balance
        if (!(error instanceof AxiosError && error.response))
        {
          setWalletInfo({ currentBalance: demoWalletBalance, totalAddedFund: 10000, totalSpendFund: 5897 })
        }
        else if (error instanceof AxiosError && error.response)
        {
          await apiActionAsync(error.response)
        }
      }
    })
  }, [])


  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className='flex flex-row items-center gap-2.5'>
            <span className='text-xl'>Current balance Rs:</span>
            <span className='text-2xl font-semibold'>{loading ? 0 : walletInfo.currentBalance}</span>
          </CardTitle>
        </CardHeader>
        {/* <CardContent className="grid grid-cols-2 gap-4 p-4">
          <div className="rounded-lg bg-green-500/10 p-3 text-center">
            <ArrowDownLeft className="mx-auto mb-1 h-5 w-5 text-green-600" />
            <p className="text-xs text-muted-foreground">Total Added</p>
            <p className="font-semibold text-green-600">Rs {loading ? 0 : walletInfo.totalAddedFund}</p>
          </div>
          <div className="rounded-lg bg-red-500/10 p-3 text-center">
            <ArrowUpRight className="mx-auto mb-1 h-5 w-5 text-red-600" />
            <p className="text-xs text-muted-foreground">Total Spent</p>
            <p className="font-semibold text-red-600">Rs {loading ? 0 : walletInfo.totalSpendFund}</p>
          </div>
        </CardContent> */}
      </Card>
    </div>
  )
}

export default CurrentBalance