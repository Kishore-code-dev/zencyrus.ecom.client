import { useEffect } from "react";
import { useLocation } from "react-router";
import { pageView } from "./gtag";

export default function PageTracker()
{
    const location = useLocation();

    useEffect(() =>
    {
        pageView(location.pathname + location.search);
    }, [location]);

    return null;
}