"use client"

import { Dispatch, SetStateAction, useCallback, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { TravelDayData } from "@/types/geo"
import { LineStringProperties } from "@/lib/geoHelpers"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form"
import { Icons } from "@/components/icons"
import Map from "@/components/map"

import GPXInput from "./gpx-input"

export default function AddTrackPage() {
  const [unsuccessful, setUnsuccessful] = useState<string[]>([])
  const [travelDayDataList, setTravelDayDataList] = useState<TravelDayData[]>(
    []
  )
  const [fileReadCompleted, setFileReadCompleted] = useState(false)
  const [removedLayerIds, setRemovedLayerIds] = useState<string[]>([])

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const step = searchParams.get("step") || ""

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const { toast } = useToast()
  const handleDelete = (travelDayData: TravelDayData) => {
    const id = travelDayData.date.toString()

    toast({
      title: "Delete Item from List",
      description: `Deleted: ${travelDayData.date.toDateString()}`,
      action: (
        <ToastAction altText="Undo" onClick={() => handleUndo(id)}>
          Undo
        </ToastAction>
      ),
      variant: "destructive",
    })

    setRemovedLayerIds([...removedLayerIds, id])
  }

  const handleUndo = (id: string) => {
    setRemovedLayerIds(removedLayerIds.filter((item) => item !== id))
  }

  const filterDeleted = (travelDayData: TravelDayData) => {
    const id = travelDayData.date.toString()
    return !removedLayerIds.includes(id)
  }

  const handleSort = (a: TravelDayData, b: TravelDayData) => {
    return a.date.getTime() - b.date.getTime()
  }

  return (
    <div>
      {step === "show-map" ? (
        <div className="md:flex">
          <Map
            className="h-[calc(100vh-24rem-4rem-1px)] md:h-[calc(100vh-4rem-1px)] md:w-2/3"
            lineStrings={travelDayDataList.map((travelDayData) => {
              const lineString: GeoJSON.Feature<
                GeoJSON.LineString,
                LineStringProperties
              > = {
                geometry: travelDayData.lineString.geometry,
                properties: travelDayData.lineString.properties,
                type: "Feature",
                id: travelDayData.date.toString(),
                bbox: travelDayData.lineString?.bbox,
              }
              return lineString
            })}
            removedLayerIds={removedLayerIds}
          />
          <div className="h-96 md:h-[calc(100vh-4rem-3.5rem-1px)] md:w-1/3">
            <div className=" grid h-14 place-items-center px-2">
              <Button className="w-full max-w-xs items-center">
                <Icons.upload className="mr-2 h-4 w-4" /> Upload
              </Button>
            </div>
            <ScrollArea className="h-full w-full">
              <ol className="m-2">
                {travelDayDataList
                  .filter(filterDeleted)
                  .sort(handleSort)
                  .map((travelDayData, index) => (
                    <TravelDayListItem
                      key={index}
                      travelDayData={travelDayData}
                      handleDelete={handleDelete}
                    />
                  ))}
              </ol>
            </ScrollArea>
          </div>
        </div>
      ) : (
        <div className="container m-auto pb-8 pt-6 sm:w-3/5">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            GPX-File Upload
          </h1>
          <div>
            <div className="mt-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              <GPXInput
                setUnsuccessful={setUnsuccessful}
                setTravelDayDataList={setTravelDayDataList}
                setFileReadCompleted={setFileReadCompleted}
              />
            </div>
            {fileReadCompleted && (
              <Button
                className="mt-4 w-full"
                onClick={() => {
                  // setFileReadCompleted(false)
                  router.push(
                    pathname + "?" + createQueryString("step", "show-map")
                  )
                }}
                autoFocus={fileReadCompleted}
              >
                Show Me On The Map
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

type TravelDayListItemProps = {
  travelDayData: TravelDayData
  handleDelete: (travelDayData: TravelDayData) => void
  setTravelDayDataList?: Dispatch<SetStateAction<TravelDayData[]>>
}

const FormSchema = z.object({
  date: z.date(),
  distance: z.number().multipleOf(0.03, {
    message: "Two decimals are allowed",
  }),
})

function TravelDayListItem({
  travelDayData,
  handleDelete,
  setTravelDayDataList,
}: TravelDayListItemProps) {
  const [edit, setEdit] = useState(false)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: travelDayData.date,
      distance: travelDayData.distance,
    },
  })

  const onSubmit = () => {
    setEdit(false)
  }

  const onCancel = () => {
    form.reset()
    setEdit(false)
  }

  return (
    <li className="">
      {edit ? (
        <div className="m-2 rounded-lg border p-2 shadow-sm">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col"
            >
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="mt-2 flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <div className="item-center flex">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "yyyy-MM-dd")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <Icons.calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(event) => event && field.onChange(event)}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            defaultMonth={travelDayData.date}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <div>
                        <Button
                          className="ml-2 p-2"
                          variant={"ghost"}
                          onClick={(e) => {
                            e.preventDefault()
                            form.resetField("date")
                          }}
                        >
                          <Icons.rotateCcw width={16} height={16} />
                          <span className="sr-only">Reset Date</span>
                        </Button>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="distance"
                render={({ field }) => (
                  <FormItem className="mt-2 flex flex-col">
                    <FormLabel>Distance (in km)</FormLabel>
                    <div className="item-center flex">
                      <FormControl>
                        <Input
                          placeholder="Distance"
                          type="number"
                          {...field}
                          onChange={(event) => {
                            const newDistance: number = parseFloat(
                              event.target.value
                            )
                            const rounded = Math.round(newDistance * 100) / 100
                            field.onChange(rounded)
                          }}
                        />
                      </FormControl>
                      <div>
                        <Button
                          className="ml-2 p-2"
                          variant={"ghost"}
                          onClick={(e) => {
                            e.preventDefault()
                            form.resetField("distance")
                          }}
                        >
                          <Icons.rotateCcw width={16} height={16} />
                          <span className="sr-only">Reset Distance</span>
                        </Button>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mt-2 flex justify-end space-x-2">
                <Button size="sm" type="submit">
                  Submit
                </Button>

                <Button size="sm" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      ) : (
        <div className="flex place-content-between items-center rounded-xl p-2 hover:bg-accent hover:text-accent-foreground">
          <div>
            <div className="text-sm font-medium">
              {form.getValues().date.toDateString()}
            </div>
            <div className="text-sm text-muted-foreground">
              Distance: {form.getValues().distance.toFixed(2)} km
            </div>
          </div>

          <div>
            <Button
              className="px-2"
              variant={"ghost"}
              onClick={() => setEdit(true)}
            >
              <Icons.pencil width={16} height={16} />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              className="px-2"
              variant={"ghost"}
              onClick={() => handleDelete(travelDayData)}
            >
              <Icons.trash2 width={16} height={16} />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      )}
    </li>
  )
}
