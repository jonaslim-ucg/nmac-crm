import PatientFollowUpDashboard from './PatientFollowUpDashboard'
import PatientsDueChart from './PatientsDueChart'
import OutreachDashboard from './OutreachDashboard'
import { useGetBookingSummaryQuery, useGetCallsOutreachSummaryQuery, useGetPatientVisitTypeQuery } from '../../../../redux/services/dashboard/manager/manager.api';
import Spinner from '../../../Spinner';
// import BookingAnalyticsDashboard from './BookingAnalyticsDashboard'

const ManagerDashboardOverview = () => {
    const {data:callsOutreachData, isLoading} = useGetCallsOutreachSummaryQuery();
  console.log(callsOutreachData)
  const {data:bookingData, isLoading:isBookingLoading} = useGetBookingSummaryQuery();
  console.log(bookingData);
    const { data:visitTypeData, isLoading: isVisitTypeLoading } = useGetPatientVisitTypeQuery();
  console.log(visitTypeData);
    if (isLoading || isBookingLoading || isVisitTypeLoading) return <Spinner />;

  return (
    <>
   <div className='bg-white rounded-3xl p-6 border border-gray-200'>
     <PatientFollowUpDashboard visitTypeData={visitTypeData}/>
    <PatientsDueChart visitTypeData={visitTypeData}/>
   </div>
   <OutreachDashboard callsOutreachData={callsOutreachData} bookingData={bookingData}/>
   {/* <BookingAnalyticsDashboard/> */}
    </>
  )
}

export default ManagerDashboardOverview

