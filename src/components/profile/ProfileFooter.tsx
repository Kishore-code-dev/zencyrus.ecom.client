import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { TriangleAlert } from 'lucide-react'
import ChangePasswordBtn from '../auth/change-password/change-password-btn'
import { useAuth } from '@/hooks/use-auth'


type Props = {
    onCancel?: () => void;
};


export default function ProfileFooter({ onCancel }: Props)
{
    const { isAuthenticated, user } = useAuth()
    return (
        <Alert variant='destructive'>
            <TriangleAlert />
            <div className='grid grid-cols-1 gap-2.5'>
                <div className='space-y-2.5'>
                    <AlertTitle className='text-sm font-bold'>Warning</AlertTitle>
                    <AlertDescription className='text-xs text-primary'>Changing your password cannot be undone. Make sure to remember your new password.</AlertDescription>
                </div>
                <ChangePasswordBtn email={isAuthenticated && user ? user.email : ''} label='Change password' onCancel={onCancel} />
            </div>
        </Alert>
    )
}