import { getNewAppointmentsInfo } from '@/actions/doctor.action'
import Chart from '@/app/admin/dashboard/components/Chart'
import { getUserIdnRoleIfAuthenticated } from '@/lib/session'

export default async function DoctorDashboardGraph() {
  const doctor = await getUserIdnRoleIfAuthenticated();
  const chartData = await getNewAppointmentsInfo(doctor?.userId!)

  return (
    <Chart chartData={chartData} name="Appointments"/>
  )
}
