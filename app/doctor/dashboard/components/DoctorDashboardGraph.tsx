import { getNewAppointmentsInfo } from '@/actions/doctor.action'
import Chart from '@/app/admin/dashboard/components/Chart'

export default async function DoctorDashboardGraph() {
  const chartData = await getNewAppointmentsInfo()

  return (
    <Chart chartData={chartData} name="Appointments"/>
  )
}
