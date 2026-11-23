import { Search, SlidersHorizontal } from "lucide-react";
import { FormControl, FormLabel, FormItem, FormField } from "@/components/ui/form";
import { Combobox } from "@/components/ui/combobox"
import { useFormContext } from "react-hook-form";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { usePagedResult } from "@/hooks/use-paged-result";
import type { Filter } from "@/types/filter";
import { Button } from "../ui/button";
import { useState } from "react";
import type { CatalogFormSchemaType } from "@/config/catalog";

import
{
  Sheet,
  SheetTrigger,
  SheetContent
} from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { OptionItem } from "@/types/common";

const printingSideOptionItem: OptionItem[] = [
  {
    "label": "Single Side",
    "value": "f7ba2a38-0191-ab37-c57d-c65e0d95c45c"
  },
  {
    "label": "Double Side",
    "value": "f4d52b0d-a4fa-4dbb-b855-c215ac55e509"
  }
  // {
  //   "label": "Front / Back (F1/B1)",
  //   "value": "93dbb787-9dac-00b7-1bf3-a1b9ebd5721b"
  // },
  // {
  //   "label": "No Printing ",
  //   "value": "426dd7ed-4cf8-4d63-da5e-a641e9cca771"
  // }
]

export const SideBar = () =>
{
  const { fetchPagedResultAsync, payload } = usePagedResult()

  const [columnFilters, setColumnFilters] = useState<Filter[]>([])
  const { control, handleSubmit, reset } = useFormContext<CatalogFormSchemaType>()

  const handleSubmitAsync = async (columnFilter: CatalogFormSchemaType) =>
  {
    let columnFilters: Filter[] = []

    if (columnFilter.quantityid)
    {
      columnFilters = [
        ...columnFilters, {
          id: "quantityid",
          value: {
            alias: "product",
            dataType: "numeric",
            logic: "AND",
            matchCase: "=",
            value: columnFilter.quantityid
          }
        }]
    }

    if (columnFilter.classificationid && columnFilter.classificationid.value)
    {
      columnFilters = [
        ...columnFilters, {
          id: "classificationid",
          value: {
            alias: "product",
            dataType: "numeric",
            logic: "AND",
            matchCase: "=",
            value: columnFilter.classificationid.value
          }
        }]
    }

    if (columnFilter.gsmid && columnFilter.gsmid.value)
    {
      columnFilters = [
        ...columnFilters, {
          id: "gsmid",
          value: {
            alias: "productquantity_ibfk_1",
            dataType: "numeric",
            logic: "AND",
            matchCase: "=",
            value: columnFilter.gsmid.value
          }
        }]
    }

    if (columnFilter.mediaid && columnFilter.mediaid.value)
    {
      columnFilters = [
        ...columnFilters, {
          id: "mediaid",
          value: {
            alias: "productquantity_ibfk_1",
            dataType: "numeric",
            logic: "AND",
            matchCase: "=",
            value: columnFilter.mediaid.value
          }
        }]
    }

    if (columnFilter.producttypeid && columnFilter.producttypeid.value)
    {
      columnFilters = [
        ...columnFilters, {
          id: "producttypeid",
          value: {
            alias: "product",
            dataType: "numeric",
            logic: "AND",
            matchCase: "=",
            value: columnFilter.producttypeid.value
          }
        }]
    }

    if (columnFilter.quantityid && columnFilter.quantityid.value)
    {
      columnFilters = [
        ...columnFilters, {
          id: "quantityid",
          value: {
            alias: "productquantity_ibfk_1",
            dataType: "numeric",
            logic: "AND",
            matchCase: "=",
            value: columnFilter.quantityid.value
          }
        }]
    }

    if (columnFilter.printingsideid && columnFilter.printingsideid.value)
    {
      columnFilters = [
        ...columnFilters, {
          id: "PrintingSideId",
          value: {
            alias: "productquantity_ibfk_1",
            dataType: "numeric",
            logic: "AND",
            matchCase: "=",
            value: columnFilter.printingsideid.value
          }
        }]
    }


    if (columnFilters.length > 0)
    {
      await fetchPagedResultAsync({ ...payload, columnFilters: columnFilters, searchString: columnFilter.searchString })
      setColumnFilters(columnFilters)
    }
  }

  const resetAsync = async () =>
  {
    await fetchPagedResultAsync({ ...payload, columnFilters: [], sorting: [] })
    setColumnFilters([])
    reset()
  }

  const applyFilterAsync = async (newFilterPayload: Filter) =>
  {
    const isExisting = columnFilters.find(x => x.id == newFilterPayload.id)
    const filters = isExisting ? columnFilters.map(x => x.id == newFilterPayload.id ? newFilterPayload : x) : [...columnFilters, newFilterPayload]
    await fetchPagedResultAsync({ ...payload, columnFilters: filters })
    setColumnFilters(filters)
  }

  const removerFilterAsync = async (columnFilterId: string) =>
  {
    const filters = columnFilters.filter(x => x.id != columnFilterId)
    await fetchPagedResultAsync({ ...payload, columnFilters: filters })
    setColumnFilters(filters)
  }

  return (
    <aside className="w-full max-w-xs">
      <div className="sticky top-24 space-y-6">
        <Sheet>
          <div className="flex items-center gap-2 lg:hidden">

            <div className="flex-1">
              <FormField
                control={control}
                name="searchString"
                render={({ field }) => (
                  <FormItem>
                    <InputGroup>
                      <InputGroupAddon>
                        <Search />
                      </InputGroupAddon>
                      <FormControl>
                        <InputGroupInput {...field} placeholder="Search product..." />
                      </FormControl>
                    </InputGroup>
                  </FormItem>
                )}
              />
            </div>

            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal />
              </Button>
            </SheetTrigger>
          </div>

          <div className="hidden lg:block">
            <FormField
              control={control}
              name="searchString"
              render={({ field }) => (
                <FormItem>
                  <InputGroup>
                    <InputGroupAddon>
                      <Search />
                    </InputGroupAddon>
                    <FormControl>
                      <InputGroupInput {...field} placeholder="Search product...." />
                    </FormControl>
                  </InputGroup>
                </FormItem>
              )}
            />
          </div>
          <SheetContent side="right" className="w-75 overflow-y-auto pt-5">
            <div className="text-xl font-semibold mb-0 ml-4">
              Filters
            </div>
            <form
              className="space-y-4"
              onSubmit={handleSubmit(handleSubmitAsync)}
            >
              <FilterContent
                control={control}
                applyFilterAsync={applyFilterAsync}
                removerFilterAsync={removerFilterAsync}
                resetAsync={resetAsync}
              />
            </form>
          </SheetContent>
        </Sheet>

        <div className="hidden lg:block">
          <form
            className="space-y-4"
            onSubmit={handleSubmit(handleSubmitAsync)}
          >
            <FilterContent
              control={control}
              applyFilterAsync={applyFilterAsync}
              removerFilterAsync={removerFilterAsync}
              resetAsync={resetAsync}
            />
          </form>
        </div>
      </div>
    </aside>
  );
};

const FilterContent = ({
  control,
  applyFilterAsync,
  removerFilterAsync,
  resetAsync
}: any) =>
{
  return (
    <div className="px-2.5 py-2.5">
      <div className="flex flex-col gap-2">
        {/* Product Type */}
        <FormField
          control={control}
          name="producttypeid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Type</FormLabel>
              <FormControl>
                <Combobox
                  value={field.value}
                  onValueChange={async (val) =>
                  {
                    if (val?.value)
                    {
                      await applyFilterAsync({
                        id: "producttypeid",
                        value: {
                          alias: "product",
                          dataType: "numeric",
                          logic: "AND",
                          matchCase: "=",
                          value: val.value
                        }
                      });
                    } else
                    {
                      await removerFilterAsync("producttypeid");
                    }
                    field.onChange(val);
                  }}
                  mode="dynamic"
                  path="producttype/search?optionSize=10&searchString"
                  placeholder="Product Type"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="classificationid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Classification</FormLabel>
              <FormControl>
                <Combobox
                  value={field.value}
                  onValueChange={async (classificationid) =>
                  {
                    if (classificationid && classificationid.value)
                    {
                      await applyFilterAsync({
                        id: "classificationid",
                        value: {
                          alias: "product",
                          dataType: "numeric",
                          logic: "AND",
                          matchCase: "=",
                          value: classificationid.value
                        }
                      })
                    }
                    else
                    {
                      await removerFilterAsync("classificationid")
                    }
                    field.onChange(classificationid)
                  }}
                  mode="dynamic"
                  path="classification/search?optionSize=10&searchString"
                  placeholder="Classification"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="mediaid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Media</FormLabel>
              <FormControl>
                <Combobox
                  value={field.value}
                  onValueChange={async (mediaid) =>
                  {
                    if (mediaid && mediaid.value)
                    {
                      await applyFilterAsync({
                        id: "mediaid",
                        value: {
                          alias: "productquantity_ibfk_1",
                          dataType: "numeric",
                          logic: "AND",
                          matchCase: "=",
                          value: mediaid.value
                        }
                      })
                    }
                    else
                    {
                      await removerFilterAsync("mediaid")
                    }
                    field.onChange(mediaid)
                  }}
                  mode="dynamic"
                  path="media/search?optionSize=10&searchString"
                  placeholder="Media"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="gsmid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GSM</FormLabel>
              <FormControl>
                <Combobox
                  value={field.value}
                  onValueChange={async (gsmid) =>
                  {
                    if (gsmid && gsmid.value)
                    {
                      await applyFilterAsync({
                        id: "gsmid",
                        value: {
                          alias: "productquantity_ibfk_1",
                          dataType: "numeric",
                          logic: "AND",
                          matchCase: "=",
                          value: gsmid.value
                        }
                      })
                    }
                    else
                    {
                      await removerFilterAsync("gsmid")
                    }
                    field.onChange(gsmid)
                  }}
                  mode="dynamic"
                  path="gsm/search?optionSize=10&searchString"
                  placeholder="GSM"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="printingsideid.value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Printing side </FormLabel>
              <Select
                value={field.value}
                onValueChange={async (value) =>
                {
                  await applyFilterAsync({
                    id: "printingsideid",
                    value: {
                      alias: "productquantity_ibfk_1",
                      dataType: "numeric",
                      logic: "AND",
                      matchCase: "=",
                      value: value
                    }
                  })
                }}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Printing side" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {printingSideOptionItem.map(item => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* <FormControl>
                <Combobox
                  value={field.value}
                  onValueChange={async (quantityid) =>
                  {
                    if (quantityid && quantityid.value)
                    {

                    }
                    else
                    {
                      await removerFilterAsync("printingsideid")
                    }
                    field.onChange(quantityid)
                  }}
                  mode="dynamic"
                  path="printingside/search?optionSize=10&searchString"
                  placeholder="printing side"
                />
              </FormControl> */}
            </FormItem>
          )}
        />
        {/* Reset Button */}
        <Button type="reset" onClick={resetAsync}>
          Reset
        </Button>
      </div>
    </div>
  );
};