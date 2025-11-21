import { GenerateZodType } from "@/utils";
import { z } from "zod";

export const bookTicketSchema = z.object({
    name: GenerateZodType.trimmedString('name'),
    email: GenerateZodType.trimmedString('email'),
    phone: GenerateZodType.trimmedString('phone'),
    slugEvent: GenerateZodType.trimmedString('slugEvent'),
    seats: GenerateZodType.arrayOfStringUnique('seats'),
})
export type BookTicketDTO = z.infer<typeof bookTicketSchema>;