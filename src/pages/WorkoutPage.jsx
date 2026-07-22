import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const WorkoutPage = () => {
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState(null)
  const [currentView, setCurrentView] = useState('select') // 'select', 'upload', 'results'

  const exercises = [
    {
      id: 'squats',
      name: 'Barbell Squats',
      description: 'Lower body compound exercise',
      icon: '🏋️',
      difficulty: 'Intermediate',
      muscles: ['Quads', 'Glutes', 'Hamstrings'],
      instructions: [
        'Stand with feet shoulder-width apart',
        'Keep chest up and back straight',
        'Lower until thighs are parallel to floor',
        'Drive through heels to return to start'
      ]
    },
    {
      id: 'benchpress',
      name: 'Bench Press',
      description: 'Upper body pushing exercise',
      icon: '💪',
      difficulty: 'Intermediate', 
      muscles: ['Chest', 'Shoulders', 'Triceps'],
      instructions: [
        'Lie flat on bench with feet on floor',
        'Grip bar slightly wider than shoulders',
        'Lower bar to chest with control',
        'Press bar back to starting position'
      ]
    },
    {
      id: 'deadlift',
      name: 'Deadlift',
      description: 'Full body pulling exercise',
      icon: '🏋️‍♂️',
      difficulty: 'Advanced',
      muscles: ['Back', 'Glutes', 'Hamstrings'],
      instructions: [
        'Stand with feet hip-width apart',
        'Bend at hips and knees to grip bar',
        'Keep back straight, chest up',
        'Stand up by extending hips and knees'
      ]
    },
    {
      id: 'shoulderpress',
      name: 'Shoulder Press',
      description: 'Overhead pressing movement',
      icon: '⬆️',
      difficulty: 'Intermediate',
      muscles: ['Shoulders', 'Triceps'],
      instructions: [
        'Sit or stand with weights at shoulders',
        'Press weights overhead until arms extended',
        'Lower with control back to shoulders',
        'Keep core tight throughout movement'
      ]
    }
  ]

  const handleExerciseSelect = (exerciseId) => {
    setSelectedExercise(exerciseId)
    setCurrentView('upload')
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target.result)
        setIsAnalyzing(true)
        setCurrentView('analyzing')
        
        // Simulate AI analysis
        setTimeout(() => {
          setIsAnalyzing(false)
          setAnalysisResults({
            score: Math.floor(Math.random() * 20) + 80, // 80-100
            confidence: (Math.random() * 0.2 + 0.8).toFixed(2), // 0.8-1.0
            feedback: generateFeedback(selectedExercise),
            improvements: [
              'Increase depth by 2-3 inches',
              'Keep chest more upright',
              'Maintain neutral spine position'
            ],
            metrics: {
              depth: '85%',
              speed: 'Optimal',
              form: 'Good'
            }
          })
          setCurrentView('results')
        }, 3000)
      }
      reader.readAsDataURL(file)
    }
  }

  const generateFeedback = (exerciseId) => {
    const feedbackMap = {
      squats: [
        'Good overall form with proper depth',
        'Knees tracking well over toes',
        'Maintain tight core throughout movement',
        'Consider slightly more controlled descent'
      ],
      benchpress: [
        'Excellent bar path control',
        'Good shoulder stability',
        'Maintain scapular retraction',
        'Slight arch in lower back is good'
      ],
      deadlift: [
        'Strong hip hinge movement',
        'Good starting position setup',
        'Maintain neutral spine',
        'Drive through heels effectively'
      ],
      shoulderpress: [
        'Good overhead mobility demonstrated',
        'Stable core throughout movement',
        'Proper elbow positioning',
        'Full range of motion achieved'
      ]
    }
    return feedbackMap[exerciseId] || feedbackMap.squats
  }

  const selectedExerciseData = exercises.find(e => e.id === selectedExercise)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Workout Analysis</h1>
          <p className="text-gray-600 mt-2">Get AI-powered feedback on your exercise form</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[
              { step: 1, label: 'Select Exercise', active: currentView === 'select' },
              { step: 2, label: 'Upload Video', active: currentView === 'upload' || currentView === 'analyzing' },
              { step: 3, label: 'Get Results', active: currentView === 'results' }
            ].map(({ step, label, active }) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  active ? 'bg-red-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {step}
                </div>
                <span className={`ml-2 text-sm ${active ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                  {label}
                </span>
                {step < 3 && <div className="w-12 h-0.5 bg-gray-300 mx-4"></div>}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Exercise Selection View */}
          {currentView === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose an Exercise to Analyze</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {exercises.map((exercise) => (
                  <motion.button
                    key={exercise.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleExerciseSelect(exercise.id)}
                    className="text-left p-6 border-2 border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-all"
                  >
                    <div className="flex items-start space-x-4">
                      <span className="text-3xl">{exercise.icon}</span>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{exercise.name}</h3>
                        <p className="text-gray-600 mb-3">{exercise.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {exercise.difficulty}
                          </span>
                          {exercise.muscles.map(muscle => (
                            <span key={muscle} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                              {muscle}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Upload View */}
          {currentView === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Record Your {selectedExerciseData?.name}
                </h2>
                <p className="text-gray-600 mb-8">
                  Upload a video or photo of you performing the exercise
                </p>

                {/* Exercise Instructions */}
                {selectedExerciseData && (
                  <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
                    <h3 className="font-semibold text-gray-900 mb-4">Proper Form Instructions:</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                      {selectedExerciseData.instructions.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-red-300 transition-colors cursor-pointer"
                     onClick={() => document.getElementById('workout-video').click()}>
                  <input 
                    id="workout-video"
                    type="file" 
                    accept="image/*,video/*" 
                    onChange={handleImageUpload}
                    className="hidden" 
                  />
                  <div className="text-6xl mb-4">📹</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Workout Video/Photo</h3>
                  <p className="text-gray-600 mb-4">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">Supports MP4, MOV, JPG, PNG • Max 100MB</p>
                </div>

                <button
                  onClick={() => setCurrentView('select')}
                  className="mt-6 text-red-600 hover:text-red-700 font-medium"
                >
                  ← Choose different exercise
                </button>
              </div>
            </motion.div>
          )}

          {/* Analyzing View */}
          {currentView === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-lg p-12 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-6"
              />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Analyzing Your Form</h2>
              <p className="text-gray-600">Our AI is processing your video and analyzing your exercise technique...</p>
              <motion.p
                className="text-gray-500 mt-4"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                This may take a few seconds
              </motion.p>
            </motion.div>
          )}

          {/* Results View */}
          {currentView === 'results' && analysisResults && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Complete!</h2>
                <p className="text-gray-600">Here's your form analysis for {selectedExerciseData?.name}</p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Score Card */}
                <div className="lg:col-span-1 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl p-6 text-white text-center">
                  <h3 className="text-lg font-semibold mb-4">Overall Score</h3>
                  <div className="text-5xl font-bold mb-2">{analysisResults.score}/100</div>
                  <div className="text-red-100">Confidence: {(analysisResults.confidence * 100).toFixed(1)}%</div>
                  <div className="mt-4 text-sm text-red-100">
                    {analysisResults.score >= 90 ? 'Excellent form!' : 
                     analysisResults.score >= 80 ? 'Good form with minor improvements' :
                     analysisResults.score >= 70 ? 'Fair form, needs work' :
                     'Needs significant improvement'}
                  </div>
                </div>

                {/* Feedback */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Form Feedback</h3>
                    <div className="space-y-3">
                      {analysisResults.feedback.map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                          <span className="text-green-600 text-lg">✓</span>
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Areas for Improvement</h3>
                    <div className="space-y-3">
                      {analysisResults.improvements.map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <span className="text-yellow-600 text-lg">💡</span>
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-gray-200">
                <button
                  onClick={() => {
                    setCurrentView('upload')
                    setUploadedImage(null)
                    setAnalysisResults(null)
                  }}
                  className="flex-1 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                  Analyze Another Video
                </button>
                <button
                  onClick={() => {
                    setCurrentView('select')
                    setSelectedExercise(null)
                    setUploadedImage(null)
                    setAnalysisResults(null)
                  }}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Choose Different Exercise
                </button>
                <button className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                  Save Results
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default WorkoutPage
