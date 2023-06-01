"use client"

import { useState } from "react"
import { redirect } from "next/dist/server/api-utils"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Currency, Expense, ExpenseCategory } from "@prisma/client"
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

async function postExpense(data: FormSchema) {
  const result = await fetch("/api/expenses", {
    method: "POST",
    body: JSON.stringify(data),
  })
  return result
}

function setDefaultValues(lastExpense: Expense | null, currencies: Currency[]) {
  if (!lastExpense)
    return {
      date: new Date(),
      categoryId: "Food and Drink",
      currencyId:
        currencies.find((currency) => currency.code === "EUR")?.id || 1,
    }
  return {
    date: new Date(lastExpense.date),
    categoryId: lastExpense.categoryId,
    currencyId: lastExpense.currencyId,
  }
}

type FormSchema = z.infer<typeof createExpensesSchema> // string

type Props = {
  currencies: Currency[]
  categories: ExpenseCategory[]
  lastExpense: Expense | null
}

export function AddExpenseForm({ currencies, categories, lastExpense }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const defaultValues = setDefaultValues(lastExpense, currencies)
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(createExpensesSchema),
    defaultValues,
  })

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    setIsLoading(true)

    const result = await postExpense(data)

    if (result.ok) {
      router.refresh()
      router.push("/user/expenses")
    }
  }

  return (
    <div className="rounded-sm border p-4">
      <h1 className="mb-4 text-2xl font-semibold md:text-3xl">Add Expense</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-2"
      >
        <div>
          <div className="flex w-full gap-2">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="amount">Amount</Label>
              <Input
                {...register("amount", { valueAsNumber: true })}
                autoFocus
                className="w-full"
                type="number"
                step=".01"
                onChange={(event) => {
                  const value = parseFloat(event.target.value)
                  const rounded = Math.floor(value * 100) / 100
                  setValue("amount", rounded)
                }}
              />
            </div>

            <div className="w-ful grid items-center gap-1.5">
              <Label htmlFor="currencyId">Currency</Label>
              <Select
                defaultValue={getValues("currencyId").toString()}
                onValueChange={(e) => {
                  setValue("currencyId", +e)
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem
                      key={currency.id}
                      value={currency.id.toString()}
                    >
                      {currency.currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="text-sm text-destructive">{errors.amount?.message}</p>
          <p className="text-sm text-destructive">
            {errors.currencyId?.message}
          </p>
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
          <Select
            defaultValue={getValues("categoryId")}
            onValueChange={(e) => {
              setValue("categoryId", e)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.category} value={category.category}>
                  {category.category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-destructive">
            {errors.categoryId?.message}
          </p>
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="date">Date</Label>
          <div className="flex w-full gap-2">
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
                  // fixedWeeks
                  defaultMonth={getValues("date")}
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
            <Button
              variant={"outline"}
              onClick={() => setValue("date", new Date())}
            >
              Today
            </Button>
          </div>
          <p className="text-sm text-destructive">{errors.date?.message}</p>
        </div>

        <Button className="mt-4" disabled={isLoading} type="submit">
          {isLoading && <Icons.loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </div>
  )
}
