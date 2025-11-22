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

export const generatePaginationSchema = () => {
    return z.object({
        limit: z.coerce.number({ message: 'limit should be number' }).min(1).optional().default(100),
        currentPage: z.coerce.number({ message: 'currentPage should be number' }).min(1).optional().default(1),
    })
}


type PaginationResult = {
    currentPage: number;
    limit: number;
    totalData: number;
    totalPage: number;
    nextPage: number | null;
    previousPage: number | null;
};

/**
 * Generate pagination info
 * @param currentPage current page number (1-based)
 * @param limit items per page
 * @param totalData total number of items
 */
export function paginate(
    currentPage: number,
    limit: number,
    totalData: number
): PaginationResult {
    const totalPage = Math.ceil(totalData / limit);

    const nextPage =
        currentPage < totalPage ? currentPage + 1 : null;

    const previousPage =
        currentPage > 1 ? currentPage - 1 : null;

    return {
        currentPage,
        limit,
        totalData,
        totalPage,
        nextPage,
        previousPage,
    };
}