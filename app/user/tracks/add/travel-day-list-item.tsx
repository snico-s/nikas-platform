"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { SubmitHandler, useForm } from "react-hook-form"
import * as z from "zod"

import { TravelDayData } from "@/types/geo"
import { trackCreateSchema } from "@/types/zod"
import { cn, sameDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form"
import { Icons } from "@/components/icons"

type TravelDayListItemProps = {
  travelDayData: TravelDayData
  handleDelete: (travelDayData: TravelDayData) => void
  setTravelDayDataList: Dispatch<SetStateAction<TravelDayData[]>>
  upload: boolean
}

const FormSchema = trackCreateSchema

function TravelDayListItem({
  travelDayData,
  handleDelete,
  upload,
  setTravelDayDataList,
}: TravelDayListItemProps) {
  const [edit, setEdit] = useState(false)
  const [error, setError] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: travelDayData.date,
      distance: travelDayData.distance,
      track: travelDayData.lineString,
    },
  })

  const onSubmitAndCloseEdit = () => {
    setEdit(false)
  }

  const onCancel = () => {
    form.reset()
    setEdit(false)
  }

  useEffect(() => {
    console.log("useEffect Upload")
    const onSubmit: SubmitHandler<z.infer<typeof trackCreateSchema>> = async (
      formData
    ) => {
      try {
        const response = await fetch("/api/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
        if (response.ok) {
          setTravelDayDataList((prev) =>
            prev.filter((item) => sameDate(item.date, travelDayData.date))
          )
        }
      } catch (error) {
        setError(true)
        console.error(error)
      }

      setEdit(false)
    }
    if (upload) form.handleSubmit(onSubmit)()
  }, [upload, form, setTravelDayDataList, travelDayData.date])

  return (
    <li>
      {edit ? (
        <div className="m-2 rounded-lg border p-2 shadow-sm">
          <div
            className={cn(
              error && "my-1 border border-destructive",
              "flex place-content-between items-center rounded-xl p-2 hover:bg-accent hover:text-accent-foreground"
            )}
          ></div>
          <Form {...form}>
            <form className="flex flex-col">
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
                            modifiers={{ prev: travelDayData.date }}
                            modifiersClassNames={{
                              prev: "border  border-primary",
                            }}
                            selected={field.value}
                            onSelect={(event) => {
                              if (!event) return
                              // see: https://stackoverflow.com/questions/17545708/parse-date-without-timezone-javascript
                              const userTimezoneOffset =
                                event.getTimezoneOffset() * 60000

                              field.onChange(
                                new Date(event.getTime() - userTimezoneOffset)
                              )
                            }}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            defaultMonth={travelDayData.date}
                            initialFocus
                          />
                          ()
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
                <Button size="sm" onClick={onSubmitAndCloseEdit}>
                  Ok
                </Button>

                <Button size="sm" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      ) : (
        <div
          className={cn(
            error && "my-1 border border-destructive",
            "flex place-content-between items-center rounded-xl p-2 hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <div>
            <Form {...form}>
              <form className="flex flex-col">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="mt-2 flex flex-col">
                      <div className="text-sm font-medium">
                        {form.getValues().date.toDateString()}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="distance"
                  render={({ field }) => (
                    <FormItem className="mt-2 flex flex-col">
                      <div className="text-sm text-muted-foreground">
                        Distance: {form.getValues().distance.toFixed(2)} km
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
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

export default TravelDayListItem
