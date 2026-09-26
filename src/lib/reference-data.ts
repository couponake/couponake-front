import type { CategoryItem, paginationProps } from "@/types";

type ObjectValue = Record<string, unknown>;
function object(value: unknown): value is ObjectValue {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function text(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
function invalid(): never {
  throw new Error("Invalid public reference data response");
}

function pagination(value: unknown, count: number): paginationProps {
  if (!object(value)) return invalid();
  const { current_page, last_page, per_page, total } = value;
  const expectedLastPage =
    total === 0
      ? 0
      : Math.max(1, Math.ceil((total as number) / (per_page as number)));

  if (
    current_page !== 1 ||
    !Number.isInteger(last_page) ||
    !Number.isInteger(per_page) ||
    !Number.isInteger(total) ||
    (per_page as number) <= 0 ||
    (total as number) < 0 ||
    last_page !== expectedLastPage ||
    count !== Math.min(total as number, per_page as number)
  )
    return invalid();

  return { ...value, from: count ? 1 : 0, to: count } as paginationProps;
}

export function validateCategories(value: unknown) {
  if (
    !object(value) ||
    value.success !== true ||
    !Array.isArray(value.categories)
  )
    return invalid();
  const ids = new Set(),
    slugs = new Set();
  for (const item of value.categories) {
    if (
      !object(item) ||
      !Number.isInteger(item.id) ||
      !text(item.name) ||
      !text(item.slug) ||
      !text(item.image) ||
      ids.has(item.id) ||
      slugs.has(item.slug)
    )
      return invalid();
    ids.add(item.id);
    slugs.add(item.slug);
  }
  return {
    categories: value.categories as CategoryItem[],
    pagination: pagination(value.pagination, value.categories.length),
    filters: {},
  };
}

export type CountryEntry = { name: string; meta: Record<string, unknown> };
export function validateCountries(value: unknown) {
  if (
    !object(value) ||
    value.status !== "success" ||
    !Array.isArray(value.data)
  )
    return invalid();
  const names = new Set();
  for (const item of value.data) {
    if (
      !object(item) ||
      !text(item.name) ||
      !object(item.meta) ||
      names.has(item.name)
    )
      return invalid();
    names.add(item.name);
  }
  return {
    data: value.data as CountryEntry[],
    meta: pagination(value.meta, value.data.length),
  };
}

export function validateCountryOptions(value: unknown): string[] {
  if (
    !object(value) ||
    value.status !== "success" ||
    !Array.isArray(value.data) ||
    !value.data.every(text) ||
    new Set(value.data).size !== value.data.length
  )
    return invalid();

  const meta = pagination(value.meta, value.data.length);

  // لو القائمة فاضية الـ last_page بيكون 0، ولو فيها بيانات بيكون 1
  const expectedLastPage = value.data.length > 0 ? 1 : 0;
  if (meta.last_page !== expectedLastPage) return invalid();

  return value.data;
}
