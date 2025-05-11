'use client'

import { useUser } from '@/contexts/UserContext'
import Header from '@/components/header'
import Loading from './loading'

export default function Dashboard() {
  const { user, profile, loading } = useUser()
  if (!user && !profile) return null
  
  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-[#203F30] mb-6">Dashboard</h1>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-[#203F30] mb-4">Welcome, {profile?.full_name}</h2>
            <p className="text-[#1A1A1A]">
              {`This is your ClaimMate dashboard. Here you'll be able to manage your claims and access all features.`}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-[#203F30] mb-3">Claims</h3>
              <p className="text-[#1A1A1A] mb-4">You have no active claims.</p>
              <button className="text-[#203F30] font-medium hover:underline">Create new claim</button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-[#203F30] mb-3">Templates</h3>
              <p className="text-[#1A1A1A] mb-4">You have no saved templates.</p>
              <button className="text-[#203F30] font-medium hover:underline">Create template</button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-[#203F30] mb-3">Recent Activity</h3>
              <p className="text-[#1A1A1A]">No recent activity to display.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
