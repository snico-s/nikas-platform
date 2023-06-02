"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { SubmitHandler, useForm } from "react-hook-form"
import * as z from "zod"

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
import { CreateTrack } from "@/components/add-track"
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
  travelDayData: CreateTrack
  setTravelDayDataList: Dispatch<SetStateAction<CreateTrack[]>>
}

const FormSchema = trackCreateSchema

function TravelDayListItem({
  travelDayData,
  setTravelDayDataList,
}: TravelDayListItemProps) {
  const [edit, setEdit] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: travelDayData.date,
      distance: travelDayData.distance,
      track: travelDayData.track,
    },
  })

  const onSubmitAndCloseEdit = () => {
    setEdit(false)
  }

  const onCancel = () => {
    form.reset()
    setEdit(false)
  }

  return (
    <li>
      {edit ? (
        <div className="m-2 rounded-lg border p-2 shadow-sm">
          <div
            className={cn(
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

                              const newDate = new Date(
                                event.getTime() - userTimezoneOffset
                              )

                              field.onChange(newDate)

                              setTravelDayDataList((prev) => {
                                const newArray = prev.map((item) => {
                                  if (item.id !== travelDayData.id) return item
                                  return { ...item, date: newDate }
                                })

                                return newArray
                              })
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

                            setTravelDayDataList((prev) => {
                              const newArray = prev.map((item) => {
                                if (item.id !== travelDayData.id) return item
                                return { ...item, distance: rounded }
                              })
                              return newArray
                            })
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
          </div>
        </div>
      )}
    </li>
  )
}

export default TravelDayListItem
