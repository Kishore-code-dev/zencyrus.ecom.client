import type { FC } from "react";

interface FlashPanelProps {}

const FlashPanel: FC<FlashPanelProps> = () => {
    return (
        <header className="h-10 w-full grid">
            <marquee className="my-auto font-bold">
                Online Customer Helpline 7358992255 / 7397739633 / 9500525571 /
                9994902293 (Tamil Nadu) | 8220118444 (Kerala) | 7397132333 &
                7397739833 (Other States)
            </marquee>
        </header>
    );
};

export default FlashPanel;
