import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/catalog/PageHeader";
import { SideBar } from "@/components/catalog/SideBar";
import Toolbar from "@/components/catalog/Toolbar";
import Products from "@/components/catalog/Products";
import PagedResult from "@/components/paged-result/paged-result";
import { useSearchParams } from "react-router";
import type { Filter } from "@/types/filter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { catalogformSchema, type CatalogFormSchemaType } from "@/config/catalog";


export default function Catalog()
{
  const form = useForm<CatalogFormSchemaType>({
    resolver: zodResolver(catalogformSchema),
    defaultValues: {
      searchString: "",
      categoryid: {
        label: "",
        value: ""
      },
      classificationid: {
        label: "",
        value: ""
      },
      mediaid: {
        label: "",
        value: ""
      },
      gsmid: {
        label: "",
        value: ""
      },
      printingsideid: {
        label: "",
        value: ""
      },
      producttypeid: {
        label: "",
        value: ""
      },
      quantityid: {
        label: "",
        value: ""
      },
      // price: {
      //   max: 1000,
      //   min: 100
      // },
    },
    mode: "onSubmit"
  });

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchParams] = useSearchParams()
  const productTypeIdLabel = searchParams.get("label")
  const productTypeIdValue = searchParams.get("value")
  const columnFilter: Filter[] = useMemo(() =>
  {
    if (productTypeIdValue)
    {
      return [{
        id: "producttypeid",
        value: {
          alias: "product",
          dataType: "numeric",
          logic: "AND",
          matchCase: "=",
          value: productTypeIdValue
        }
      }]
    }

    return []
  }, [productTypeIdLabel, productTypeIdValue])

  useEffect(() =>
  {
    if (productTypeIdLabel && productTypeIdValue)
    {
      form.setValue("producttypeid.value", productTypeIdValue)
      form.setValue("producttypeid.label", productTypeIdLabel)
    }
  }, [productTypeIdLabel, productTypeIdValue])

  return (
    <Form {...form}>
      <div className="min-h-screen w-full bg-background">
        {/* Page Header */}
        <PageHeader />
        <div className="w-full mx-auto p-8">
          {/* Products */}
          <PagedResult path="product" viewId="" defaultFilters={columnFilter}>
            <div className="flex flex-col lg:flex-row gap-8">
              <SideBar />
              {/* Products Grid */}
              <main className="flex-1">
                <Toolbar viewMode={viewMode} setViewMode={setViewMode} />
                <Products viewMode={viewMode} />
                <div className="grid grid-cols-2 place-content-between">
                  <PagedResult.PageSize className="mr-auto" />
                  <PagedResult.Pagination className="ml-auto" />
                </div>
              </main>
            </div>
          </PagedResult>
        </div>
      </div>
    </Form>
  );
}
