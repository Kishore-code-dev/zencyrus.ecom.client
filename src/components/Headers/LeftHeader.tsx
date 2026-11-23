import { Link } from 'react-router';

export default function LeftHeader()
{
  return (
    <Link to="/" className="flex items-center gap-2 shrink-0 ml-0 pl-0 ">
      <img
        loading="lazy"
        decoding="async" src="/images/logo.svg"
        alt="Gokul Printers"
        className="size-32 w-auto"
      />
      <div className="hidden xl:block">
        <h1 className="font-display text-xl font-bold text-foreground">Gokul Printers</h1>
        <p className="text-xs text-muted-foreground">B2B Printing Solutions</p>
      </div>
    </Link>
  );
}
