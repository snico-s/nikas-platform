import { z } from "zod"

export const createExpensesSchema = z.object({
  amount: z.number(),
  categoryId: z.string(),
  description: z.string(),
  date: z.date(),
  currencyId: z.number(),
})
