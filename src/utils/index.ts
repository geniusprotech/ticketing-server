import z from "zod";
import { EnumLike } from "zod/v3";

export class GenerateZodType {
    static trimmedString(propertyName: string) {
        return z
            .string({ message: `${propertyName} is required to be string` })
            .min(1, { message: `${propertyName} cannot be empty` })
            .transform((value: string) => value.trim())
    }

    static trimmedStringOptional(propertyName: string) {
        return z
            .string({ message: `${propertyName} should be string` })
            .transform((value: any) => value.trim())
            .optional()
    }

    static arrayOfStringUnique(propertyName: string) {
        return z.array(
            z.string({ message: `${propertyName} should be array of string` }).transform((value) => value.trim()),
            { message: `${propertyName} should be array of string` }
        )
            .nonempty(`${propertyName} should not be empty`)
            .refine((data: any) => {
                return new Set(data).size === data.length;
            }, {
                message: `${propertyName} elements must be unique`,
            });
    }

    static arrayOfStringUniqueOptional(propertyName: string) {
        return z.array(
            z.string({ message: `${propertyName} should be array of string` }).transform((value: any) => value.trim()),
            { message: `${propertyName} should be array of string` }
        )
            .refine((data) => {
                return new Set(data).size === data.length;
            }, {
                message: `${propertyName} elements must be unique`,
            });
    }

    static arrayOfNumberUnique(propertyName: string) {
        return z.array(
            z.number({ message: `${propertyName} should be array of number` }),
            { message: `${propertyName} should be array of number` }
        )
            .nonempty(`${propertyName} should not be empty`)
            .refine((data: any) => {
                return new Set(data).size === data.length;
            }, {
                message: `${propertyName} elements must be unique`,
            });
    }

    static arrayOfNumberUniqueOptional(propertyName: string) {
        return z.array(
            z.number({ message: `${propertyName} should be array of number` }),
            { message: `${propertyName} should be array of number` }
        )
            .refine((data) => {
                return new Set(data).size === data.length;
            }, {
                message: `${propertyName} elements must be unique`,
            });
    }

    static date(propertyName: string) {
        return z
            .string({ message: `${propertyName} is required` })
            .regex(/^\d{4}-\d{2}-\d{2}$/, {
                message: `${propertyName} must be YYYY-MM-DD format`,
            });
    }

    static boolean(propertyName: string) {
        return z.boolean({ message: `${propertyName} should be boolean` })
    }

    static enumerate(enumObject: EnumLike) {
        return z.enum(enumObject, { message: `Invalid enum value. Expected ${Object.values(enumObject).join(' | ')}` })
    }
}