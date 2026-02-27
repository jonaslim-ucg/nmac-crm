import SalesAgentCard from './SalesAgentCard'
import CallsAppointmentsChart from './CallsAppointmentsChart'
import ConversionRateComparison from './ConversionRateComparison'
import { useGetTopAgentsQuery } from '../../../../redux/services/dashboard/manager/manager.api'
import Spinner from '../../../Spinner'

const SalesAgent = () => {
  const { data: agents = [], isLoading, isError } = useGetTopAgentsQuery();

  if (isLoading) return <Spinner />;

  if (isError) {
    return (
      <div className="p-6 text-center text-red-500 bg-white rounded-2xl border border-gray-200">
        Failed to load agent performance data.
      </div>
    );
  }

  return (
    <div>
      <div className='bg-white p-6 rounded-2xl border-gray-200 border'>
        <SalesAgentCard agents={agents} />
        <CallsAppointmentsChart agents={agents} />
      </div>

      <ConversionRateComparison agents={agents} />
    </div>
  )
}

export default SalesAgent