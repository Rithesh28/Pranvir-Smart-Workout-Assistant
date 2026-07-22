#!/usr/bin/env python3
"""
Pranvir - Smart Workout Assistant
Main application entry point
"""

import os
import sys

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.app import app

def main():
    # Create upload directory if it doesn't exist
    os.makedirs('static/uploads', exist_ok=True)
    
    print("🚀 Starting Pranvir - Smart Workout Assistant")
    print("📁 Upload folder: static/uploads")
    print("🌐 Server running on: http://localhost:5000")
    print("🔧 Debug mode: ON")
    
    # Run the application
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )

if __name__ == '__main__':
    main()