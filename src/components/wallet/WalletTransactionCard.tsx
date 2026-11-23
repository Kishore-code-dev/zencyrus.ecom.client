import { usePagedResult } from "@/hooks/use-paged-result"
import type { WalletTransaction } from "@/types/wallet"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { ArrowDownLeft, ArrowUpRight } from "lucide-react"
import { format } from "date-fns"

export default function WalletTransactionCard()
{
    const { pagedResult } = usePagedResult()
    return (
        <div className="grid grid-cols-1 gap-2.5 w-full">
            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>Your recent wallet activity</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {(pagedResult.items as WalletTransaction[]).map(transaction => (
                            <div
                                key={transaction.id}
                                className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-secondary/30"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-full ${transaction.transactionType.value === '55b902e1-1167-556b-ae3b-3e8895eda122'
                                            ? 'bg-green-500/20 text-green-600'
                                            : 'bg-red-500/20 text-red-600'
                                            }`}
                                    >
                                        {transaction.transactionType.value === '55b902e1-1167-556b-ae3b-3e8895eda122' ? (
                                            <ArrowDownLeft className="h-5 w-5" />
                                        ) : (
                                            <ArrowUpRight className="h-5 w-5" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium">{transaction.referenceNo}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {format(transaction.transactionOn, 'MMM d, yyyy • h:mm a')}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Badge
                                        className={
                                            transaction.transactionType.value === '55b902e1-1167-556b-ae3b-3e8895eda122'
                                                ? 'bg-green-500/20 text-green-600 border-green-500/30'
                                                : 'bg-red-500/20 text-red-600 border-red-500/30'
                                        }
                                    >
                                        {transaction.transactionType.value === '55b902e1-1167-556b-ae3b-3e8895eda122' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
