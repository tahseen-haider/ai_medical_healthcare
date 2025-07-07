import React from 'react'
import Chart from './Chart'
import { getNewUserInfo } from '@/actions/admin.action'

export default async function AdminDashboardGraph() {
  const chartData = await getNewUserInfo()
  return (
    <Chart chartData={chartData} name='Users'/>
  )
}
