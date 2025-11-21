import { GenerateZodType } from '@/utils';
import { z } from 'zod';

export const UserSchema = z.object({
  email: GenerateZodType.trimmedString('email'),
  password: GenerateZodType.trimmedStringOptional('password').nullable(),
});
export type UserInput = z.infer<typeof UserSchema>;