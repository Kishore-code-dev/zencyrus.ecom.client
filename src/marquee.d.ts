import "react";

declare module "react" {
    namespace JSX {
        interface IntrinsicElements {
            marquee: React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement> & {
                    behavior?: "scroll" | "slide" | "alternate";
                    direction?: "left" | "right" | "up" | "down";
                    scrollamount?: number;
                    scrolldelay?: number;
                    loop?: number;
                },
                HTMLElement
            >;
        }
    }
}
