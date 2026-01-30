export const GRADUATION_YEARS = [2027, 2028] as const;

export const EVENT_AREAS = ["東京", "大阪", "名古屋"] as const;

export type GraduationYear = typeof GRADUATION_YEARS[number];
export type EventArea = typeof EVENT_AREAS[number];

