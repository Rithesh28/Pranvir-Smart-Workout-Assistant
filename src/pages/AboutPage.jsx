import React from 'react'

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Pranvir</h1>
          <p className="text-xl text-gray-600">Revolutionizing fitness with AI technology</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            <h2>Our Mission</h2>
            <p>
              Pranvir is dedicated to making professional-grade fitness coaching accessible to everyone. 
              Using advanced computer vision and machine learning, we provide real-time form analysis 
              and personalized workout plans that adapt to your progress.
            </p>
            
            <h2>How It Works</h2>
            <ol>
              <li><strong>Record:</strong> Use your smartphone camera to record your workouts</li>
              <li><strong>Analyze:</strong> Our AI analyzes your form in real-time</li>
              <li><strong>Improve:</strong> Get instant feedback and personalized recommendations</li>
              <li><strong>Progress:</strong> Track your improvements with detailed analytics</li>
            </ol>
            
            <h2>Our Technology</h2>
            <p>
              Built with state-of-the-art computer vision algorithms, Pranvir can detect and analyze 
              over 50 different exercises with 95%+ accuracy. Our system continuously learns and 
              improves to provide you with the best possible guidance.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
