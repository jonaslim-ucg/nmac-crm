interface CardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  bgColor: string;
  iconColor: string;
}

const SummaryCard: React.FC<CardProps> = ({ icon, title, subtitle, bgColor, iconColor }) => {
  return (
    <div className={`${bgColor} border border-gray-200 rounded-3xl px-6 py-8 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer w-full`}>
      <div className={`${iconColor} w-10 h-10 rounded-lg flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div className="flex flex-col">
        <h3 className="text-[#171C35] font-semibold text-base leading-tight">{title}</h3>
        <p className="text-gray-600 text-sm leading-tight">{subtitle}</p>
      </div>
    </div>
  );
};
export default SummaryCard;