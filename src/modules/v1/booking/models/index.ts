import { generatePaginationSchema, GenerateZodType } from "@/utils";
import { z } from "zod";

export const bookTicketSchema = z.object({
    name: GenerateZodType.trimmedString('name'),
    email: GenerateZodType.trimmedString('email'),
    phone: GenerateZodType.trimmedString('phone'),
    slugEvent: GenerateZodType.trimmedString('slugEvent'),
    seats: GenerateZodType.arrayOfStringUnique('seats'),
})
export type BookTicketDTO = z.infer<typeof bookTicketSchema>;

export const getBookingListSchema =
  generatePaginationSchema().extend({
    keyword: GenerateZodType.trimmedStringOptional('keyword'),
    exported: GenerateZodType.trimmedStringOptional('exported'),
    status:  GenerateZodType.trimmedStringOptional('status'),
  })

export type GetBookingListDTO = z.infer<typeof getBookingListSchema>;