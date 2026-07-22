import React from 'react'

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Today's Workout</h3>
            <p className="text-gray-600">Upper Body Strength</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Progress</h3>
            <p className="text-gray-600">15 workouts completed</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Next Session</h3>
            <p className="text-gray-600">Tomorrow, 7:00 AM</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
