
interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}

const CallCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  bgColor,
  iconColor,
}) => {
  return (
    <div className={`${bgColor} rounded-3xl p-4 flex flex-col h-full border border-gray-200`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        <div className={iconColor}>{icon}</div>
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

export default CallCard;