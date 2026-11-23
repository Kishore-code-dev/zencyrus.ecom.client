// import { Link } from "react-router";
// import { useEffect, useState, useTransition } from "react";
// import { useApiAction } from "@/hooks/use-api-action";
// import { AxiosError } from "axios";
// import { api } from "@/config/api";
// import { Card } from "../ui/card";
// import type { ImageOptionItem } from "@/types/common";

const CategoryWithoutGrid = () =>
{
    // const [items, setItems] = useState<ImageOptionItem[]>([]);
    // const [_, startTransition] = useTransition();
    // const { apiActionAsync } = useApiAction();

    // useEffect(() =>
    // {
    //     startTransition(async () =>
    //     {
    //         try
    //         {
    //             const response = await api.get(`producttype/getall`);
    //             if (response.status == 200 && response.data)
    //             {
    //                 setItems([...response.data]);
    //             }
    //         } catch (error)
    //         {
    //             if (error instanceof AxiosError && error.response)
    //             {
    //                 await apiActionAsync(error.response);
    //             }
    //         }
    //     });
    // }, []);

    return (
        <section className="bg-gradient-warm w-full">
            {/* <div className="h-fit w-full p-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground font-display mb-2">
                        Our Products
                    </h2>
                    <p className="text-muted-foreground font-sans">
                        Premium offset printing for every need
                    </p>
                </div>
                <div className="grid md:grid-cols-6 gap-2.5">
                    {items.map((item) => (
                        <div key={item.value} className="basis-3xs mx-auto">
                            <Link to={`/catalog?label=${item.description}&value=${item.value}`}>
                                <Card className="group relative w-full md:size-48 flex flex-col items-center rounded-xl bg-linear-to-br border border-border p-0 transition-all hover:shadow-card-hover hover:-translate-y-1">
                                    <div className="size-full flex items-center justify-center overflow-hidden rounded-md">
                                        <img
                                            loading="lazy"
                                            decoding="async"
                                            src={item.label}
                                            alt={item.description}
                                            className="h-full w-full object-contain transition-transform group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="absolute top-0 left-0 hidden group-hover:grid rounded-md h-full w-full bg-primary/50">
                                        <span className="m-auto text-sm dark:text-primary-foreground font-semibold text-white text-center">
                                            {item.description}
                                        </span>
                                    </div>
                                </Card>
                            </Link>
                        </div>
                    ))}
                </div>
            </div > */}
            <div className="p-2">
                
            </div>
        </section >
    );
};

export default CategoryWithoutGrid;