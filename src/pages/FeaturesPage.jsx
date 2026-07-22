import React from 'react'
import { Link } from 'react-router-dom'

const FeaturesPage = () => {
  const features = [
    {
      category: 'AI Analysis',
      items: [
        {
          title: 'Real-Time Form Correction',
          description: 'Instant feedback on exercise technique with detailed corrections',
          icon: '🎯'
        },
        {
          title: 'Motion Tracking',
          description: 'Advanced computer vision tracks your movements with precision',
          icon: '📹'
        },
        {
          title: 'Performance Metrics',
          description: 'Track reps, sets, tempo, and range of motion automatically',
          icon: '📊'
        }
      ]
    },
    {
      category: 'Workout Planning',
      items: [
        {
          title: 'Personalized Programs',
          description: 'AI-generated workouts based on your goals and progress',
          icon: '💪'
        },
        {
          title: 'Adaptive Scheduling',
          description: 'Workouts that adapt to your schedule and recovery needs',
          icon: '📅'
        },
        {
          title: 'Exercise Library',
          description: 'Access to 500+ exercises with video demonstrations',
          icon: '🏋️'
        }
      ]
    },
    {
      category: 'Progress Tracking',
      items: [
        {
          title: 'Detailed Analytics',
          description: 'Comprehensive insights into your fitness journey',
          icon: '📈'
        },
        {
          title: 'Goal Setting',
          description: 'Set and track specific fitness goals with milestones',
          icon: '🎯'
        },
        {
          title: 'Progress Photos',
          description: 'Visual progress tracking with photo comparisons',
          icon: '🖼️'
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Powerful Features for Your Fitness Journey
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how Pranvir's advanced features can help you achieve your fitness goals faster and more effectively.
          </p>
        </div>

        {/* Features Grid */}
        <div className="space-y-16">
          {features.map((category) => (
            <div key={category.category}>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                {category.category}
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {category.items.map((feature) => (
                  <div key={feature.title} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                    <div className="text-3xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-red-100 mb-6 text-lg">
              Join thousands of users transforming their fitness with Pranvir
            </p>
            <Link
              to="/login"
              className="inline-block px-8 py-4 bg-white text-red-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition-all"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeaturesPage
