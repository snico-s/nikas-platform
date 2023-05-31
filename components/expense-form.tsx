"use client"

import { format } from "path"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { Currency, Expense } from "@prisma/client"
import { SubmitHandler, useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { createExpensesSchema } from "@/lib/validation/expenses"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Icons } from "./icons"
import { Calendar } from "./ui/calendar"
import { Label } from "./ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Textarea } from "./ui/textarea"

type formSchema = z.infer<typeof createExpensesSchema> // string

type Props = {
  currencies: Currency[]
}

export function AddExpenseForm({ currencies }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<formSchema>({
    resolver: zodResolver(createExpensesSchema),
    defaultValues: {
      date: new Date(),
      currencyId:
        currencies.find((currency) => currency.code === "EUR")?.id || 1,
    },
  })

  const onSubmit: SubmitHandler<formSchema> = async (data) => {
    try {
      const result = await fetch("/api/expenses", {
        method: "POST",
        body: JSON.stringify(data),
      })
      console.log(result)
    } catch (error) {
      console.error(error)
    }

    console.log("Submit")
    console.log(data)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-2 rounded-sm border p-4"
    >
      <div>
        <div className="flex w-full gap-2">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="amount">Amount</Label>
            <Input
              autoFocus
              className="w-full"
              type="number"
              step=".01"
              {...register("amount", { valueAsNumber: true })}
            />
          </div>

          <div className="w-ful grid items-center gap-1.5">
            <Label htmlFor="currencyId">Currency</Label>
            <Select
              defaultValue={getValues(["currencyId"]).toString()}
              onValueChange={(e) => {
                setValue("currencyId", +e)
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.id} value={currency.id.toString()}>
                    {currency.currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="text-sm text-destructive">{errors.amount?.message}</p>
        <p className="text-sm text-destructive">{errors.currencyId?.message}</p>
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea {...register("description")} />
        <p className="text-sm text-destructive">
          {errors.description?.message}
        </p>
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="categoryId">Category</Label>
        <Input {...register("categoryId")} />
        <p className="text-sm text-destructive">{errors.categoryId?.message}</p>
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="date">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !getValues("date") && "text-muted-foreground"
              )}
            >
              <Icons.calendar className="mr-2 h-4 w-4" />
              {getValues("date") ? (
                getValues("date").toDateString()
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={getValues("date")}
              onSelect={async (event) => {
                if (!event) return
                // see: https://stackoverflow.com/questions/17545708/parse-date-without-timezone-javascript
                const userTimezoneOffset = event.getTimezoneOffset() * 60000
                const value = new Date(event.getTime() - userTimezoneOffset)
                event && setValue("date", value)
                await trigger(["date"])
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <p className="text-sm text-destructive">{errors.date?.message}</p>
      </div>

      <Button className="mt-4" type="submit">
        Submit
      </Button>
    </form>
  )
}
