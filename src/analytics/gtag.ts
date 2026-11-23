declare global
{
    interface Window
    {
        gtag: (...args: any[]) => void;
        dataLayer: any[];
    }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export const initGA = () =>
{
    if (!GA_MEASUREMENT_ID)
    {
        console.warn("Google Analytics Measurement ID is missing.");
        return;
    }


    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];

    function gtag(...args: any[])
    {
        window.dataLayer.push(args);
    }

    window.gtag = gtag;

    window.gtag("js", new Date());

    window.gtag("config", GA_MEASUREMENT_ID, {
        send_page_view: false,
    });
};

export const pageView = (url: string) =>
{
    if (!window.gtag) return;

    window.gtag("event", "page_view", {
        page_path: url,
        page_location: window.location.href,
        page_title: document.title,
    });
};

export const event = (eventName: string, params: Record<string, any> = {}) =>
{
    if (!window.gtag) return;

    window.gtag("event", eventName, params);
};