import AreaFilter from "@/components/ui/filters/AreaFilter";
import GraduationYearFilter from "@/components/ui/filters/GraduationYearFilter";
import DateRangeFilter from "@/components/ui/filters/DateRangeFilter";

export type EventFilter = {
  area: string;
  graduationYear: number | "";
  dateFrom: string;
  dateTo: string;
};

type EventFiltersProps = {
  value: EventFilter;
  onChange: (next: EventFilter) => void;
  className?: string;
};

export default function EventFilters({
  value,
  onChange,
  className,
}: EventFiltersProps) {
  return (
    <div className={`flex flex-wrap items-end gap-3 ${className ?? ""}`}>
      <AreaFilter
        value={value.area}
        onChange={(v) => onChange({ ...value, area: v })}
      />
      <GraduationYearFilter
        value={value.graduationYear}
        onChange={(v) => onChange({ ...value, graduationYear: v })}
      />
      <DateRangeFilter
        from={value.dateFrom}
        to={value.dateTo}
        onChange={(next) =>
          onChange({ ...value, dateFrom: next.from, dateTo: next.to })
        }
        onClearAll={() =>
          onChange({ area: "", graduationYear: "", dateFrom: "", dateTo: "" })
        }
      />
    </div>
  );
}
