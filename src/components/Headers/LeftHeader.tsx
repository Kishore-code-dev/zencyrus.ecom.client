import { Link } from 'react-router';
import AppLogo from '@/components/app-logo/app-logo';

export default function LeftHeader()
{
  return (
    <Link
      to="/"
      aria-label="Gokul Printers — Home"
      className="flex items-center shrink-0 py-1.5 pl-3 pr-2 sm:pl-4"
    >
      <AppLogo
        className="h-9 sm:h-10 md:h-12"
        fetchPriority="high"
      />
    </Link>
  );
}
