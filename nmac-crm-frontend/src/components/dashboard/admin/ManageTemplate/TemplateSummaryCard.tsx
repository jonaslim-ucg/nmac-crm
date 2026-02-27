
interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  bgColor: string;
}

const TemplateSummaryCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  bgColor,
}) => {
  return (
    <div className={`${bgColor} rounded-3xl p-6 flex flex-col h-full`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      </div>

      {/* Value */}
      <div className="mt-auto">
        <p className="text-3xl font-semibold text-gray-900 mb-2">{value}</p>
        {subtitle && (
          <p className="text-sm text-[#6A7282] font-normal">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default TemplateSummaryCard;