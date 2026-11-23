import { useTheme } from '@/hooks/use-theme';
import { Link } from 'react-router';

export default function LeftHeader()
{
  const { theme } = useTheme()
  return (
    <Link to="/" className="flex items-center gap-2 shrink-0 ml-0 pl-0 ">
      <img
        loading="lazy"
        decoding="async" src={theme == "light" ? '/images/logo.light.png' : '/images/logo.dark.png'}
        alt="Shree Maruthi Printers"
        className="size-32 w-auto"
      />
      {/* <div className="size-24 object-cover bg-[url('/images/logo.dark.png')]" /> */}
      <div className="hidden xl:block">
        <h1 className="font-display text-xl font-bold text-foreground">Shree Maruthi Printers</h1>
        <p className="text-xs text-muted-foreground">B2B Printing Solutions</p>
      </div>
    </Link>
  );
}
