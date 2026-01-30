import React from "react";
import { FormField, SelectInput } from "@/components/ui/form/FormField";

interface EventSelectorProps {
  selectedEventId: string;
  onEventChange: (eventId: string) => void;
  showTodayOnly: boolean;
  onShowTodayOnlyChange: (showTodayOnly: boolean) => void;
  eventOptions: { value: string; label: string }[];
}

export const EventSelector: React.FC<EventSelectorProps> = ({
  selectedEventId,
  onEventChange,
  showTodayOnly,
  onShowTodayOnlyChange,
  eventOptions,
}) => {
  return (
    <FormField label="イベント">
      <SelectInput
        name="event"
        value={selectedEventId}
        onChange={(e) => onEventChange(e.target.value)}
        options={eventOptions}
        placeholder="イベントを選択"
      />
      <div className="flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          id="show-today-only"
          checked={showTodayOnly}
          onChange={(e) => onShowTodayOnlyChange(e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label
          htmlFor="show-today-only"
          className="text-sm font-medium text-gray-700 cursor-pointer inline-block"
        >
          本日のみ表示
        </label>
      </div>
    </FormField>
  );
};





