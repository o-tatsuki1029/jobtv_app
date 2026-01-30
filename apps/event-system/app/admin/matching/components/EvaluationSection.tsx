import React from "react";

interface EvaluationSectionProps {
  title: string;
  completedCount: number;
  totalCount: number;
  children: React.ReactNode;
}

export const EvaluationSection: React.FC<EvaluationSectionProps> = ({
  title,
  completedCount,
  totalCount,
  children,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">
            全体進捗: {completedCount} / {totalCount}
          </p>
        </div>
      </div>
      <div className="p-4 max-h-[600px] overflow-y-auto">{children}</div>
    </div>
  );
};
