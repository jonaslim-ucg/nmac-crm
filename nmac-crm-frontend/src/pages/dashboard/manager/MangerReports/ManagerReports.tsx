import { Users, TrendingUp, Phone, Calendar } from 'lucide-react';
import ManagerReportsCard from '../../../../components/dashboard/manager/ManagerReports/ManagerReportsCard';
import ManagerAnalytics from '../../../../components/dashboard/manager/ManagerReports/ManagerAnalytics';
import AgentPerformanceChart from '../../../../components/dashboard/manager/ManagerReports/AgentPerformanceChart';
import {
  useGetNonBookingSummaryQuery,
  useGetTopAgentsQuery,
  useGetPatientSummaryQuery,
  useGetCallsOutreachSummaryQuery,
  useGetBookingSummaryQuery
} from '../../../../redux/services/dashboard/manager/manager.api';
import Spinner from '../../../../components/Spinner';

const ManagerReports: React.FC = () => {
  const { data: NonBookingReasons } = useGetNonBookingSummaryQuery();
  const { data: topAgents, isLoading: agentsLoading } = useGetTopAgentsQuery();
  const { data: patientSummary } = useGetPatientSummaryQuery();
  const { data: outreachSummary } = useGetCallsOutreachSummaryQuery();
  const { data: bookingSummary } = useGetBookingSummaryQuery();

  const cards = [
    {
      title: 'Total Patients',
      value: patientSummary?.total_patients || '0',
      subtitle: '',
      icon: <Users className="w-6 h-6" />,
      bgColor: 'bg-[#E4F4FF]',
      iconColor: 'text-blue-500',
    },
    {
      title: 'Total Outreach',
      value: (outreachSummary?.total_calls || 0) + (outreachSummary?.WHATSAPP || 0) + (outreachSummary?.EMAIL || 0),
      subtitle: 'Calls, WhatsApp, Emails',
      icon: <Phone className="w-6 h-6" />,
      bgColor: 'bg-[#F3E9FF]',
      iconColor: 'text-[#9810FA]',
    },
    {
      title: 'Appointments',
      value: bookingSummary?.BOOKED || '0',
      subtitle: '',
      icon: <Calendar className="w-6 h-6" />,
      bgColor: 'bg-[#FDE3D9]',
      iconColor: 'text-[#F54900]',
    },
    {
      title: 'Conversion Rate',
      value: `${bookingSummary?.CONTACTED ? Math.round((bookingSummary.BOOKED / bookingSummary.CONTACTED) * 100) : 0}%`,
      subtitle: `${bookingSummary?.BOOKED || 0} booked ÷ ${bookingSummary?.CONTACTED || 0} contacted`,
      icon: <TrendingUp className="w-6 h-6" />,
      bgColor: 'bg-[#E4F4FF]',
      iconColor: 'text-[#155DFC]',
    },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Reports & Analytics
        </h1>
        <p className="text-base text-[#6A7282] font-normal">
          Comprehensive insights into patient outreach
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <ManagerReportsCard
            key={index}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            icon={card.icon}
            bgColor={card.bgColor}
            iconColor={card.iconColor}
          />
        ))}
      </div>

      {/* analytics */}
      <ManagerAnalytics outCome={NonBookingReasons} />

      {/* performance */}
      {agentsLoading ? (
        <div className="flex justify-center p-10"><Spinner /></div>
      ) : (
        <AgentPerformanceChart agents={topAgents || []} />
      )}
    </div>
  );
};

export default ManagerReports;
