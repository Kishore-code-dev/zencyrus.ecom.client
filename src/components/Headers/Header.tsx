import LeftHeader from './LeftHeader';
import RightHeader from './RightHeader';

export function Header()
{
  return (
    <header className="w-full border-b border-border bg-card/95 backdrop-blur">
      <div className="h-fit w-full flex flex-nowrap items-center justify-between pl-0 pr-4">

        <div className="shrink-0">
          <LeftHeader />
        </div>

        <div className="shrink-0">
          <RightHeader />
        </div>

      </div>
    </header>
  );
}