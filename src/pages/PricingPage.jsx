import React from 'react'
import { Link } from 'react-router-dom'

const PricingPage = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for getting started',
      features: ['Basic form analysis', '3 workouts per week', 'Community support']
    },
    {
      name: 'Pro',
      price: '$19',
      description: 'Most popular for serious trainers',
      features: ['Advanced AI analysis', 'Unlimited workouts', 'Personalized plans', 'Priority support']
    },
    {
      name: 'Enterprise',
      price: '$49',
      description: 'For gyms and trainers',
      features: ['All Pro features', 'Multiple users', 'Advanced analytics', 'Dedicated support']
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600">Choose the plan that works best for you</p>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div key={plan.name} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="mt-4 text-gray-600">{plan.description}</p>
              <ul className="mt-6 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/login"
                className="mt-8 block w-full bg-gradient-to-r from-red-600 to-orange-600 text-white text-center py-3 rounded-lg font-semibold hover:from-red-700 hover:to-orange-700 transition-all"
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PricingPage
