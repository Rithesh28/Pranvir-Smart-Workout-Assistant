import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const HomePage = () => {
  const features = [
    {
      icon: '🏋️',
      title: 'Real-Time Form Analysis',
      description: 'Get instant feedback on your exercise technique with AI-powered form analysis.'
    },
    {
      icon: '📊',
      title: 'Personalized Workouts',
      description: 'Custom training plans that adapt to your progress, goals, and fitness level.'
    },
    {
      icon: '📈',
      title: 'Progress Tracking',
      description: 'Monitor your improvements with detailed analytics and performance insights.'
    },
    {
      icon: '👨‍💼',
      title: 'Expert Guidance',
      description: 'Access to certified trainers and AI-powered recommendations.'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Fitness Enthusiast',
      content: 'Pranvir transformed my workout routine. The form analysis helped me correct my squat technique and prevent injuries.',
      avatar: '👩'
    },
    {
      name: 'Mike Chen',
      role: 'Personal Trainer',
      content: 'As a trainer, I recommend Pranvir to all my clients. The AI insights are incredibly accurate and helpful.',
      avatar: '👨'
    },
    {
      name: 'Emily Davis',
      role: 'Yoga Instructor',
      content: 'The personalized workouts have helped me break through plateaus and achieve new fitness goals.',
      avatar: '🧘‍♀️'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Transform Your Fitness with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
                AI Power
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Pranvir uses advanced artificial intelligence to analyze your workouts, provide real-time feedback, and create personalized training programs that deliver results.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/login"
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-lg shadow-lg hover:from-red-700 hover:to-orange-700 transition-all transform hover:scale-105"
              >
                Start Free Trial
              </Link>
              <Link
                to="/features"
                className="px-8 py-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-red-300 hover:text-red-600 transition-all"
              >
                Learn More
              </Link>
            </motion.div>
          </div>

          {/* Hero Image/Video Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border border-red-100"
          >
            <div className="aspect-w-16 aspect-h-9 bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">📱</div>
              <p className="text-gray-600">Pranvir App Interface</p>
              <p className="text-sm text-gray-500 mt-2">Real-time workout analysis and feedback</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Pranvir?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform offers everything you need to achieve your fitness goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow border border-gray-200"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Record Your Workout',
                description: 'Use your phone camera to record your exercises'
              },
              {
                step: '2',
                title: 'AI Analysis',
                description: 'Our AI analyzes your form in real-time'
              },
              {
                step: '3',
                title: 'Get Feedback',
                description: 'Receive instant feedback and improvement tips'
              }
            ].map((step, index) => (
              <div key={step.step} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-6 border border-gray-200"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-100 to-orange-100 rounded-full flex items-center justify-center text-2xl mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-orange-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Fitness Journey?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Join thousands of users who have achieved their fitness goals with Pranvir.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="px-8 py-4 bg-white text-red-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              Start Your Free Trial
            </Link>
            <Link
              to="/pricing"
              className="px-8 py-4 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-red-600 transition-all"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
