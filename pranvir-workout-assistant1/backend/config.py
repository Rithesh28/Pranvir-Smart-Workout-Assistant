import os
from datetime import timedelta

class Config:
    """Base configuration"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'pranvir-smart-workout-secret-key-2024'
    
    # File upload settings
    UPLOAD_FOLDER = 'static/uploads'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    
    # Session settings
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)
    
    # Model paths (Update these paths to your actual model locations)
    MODEL_PATHS = {
        'squat': r"C:\Users\MANIKANTA\pranvir-workout-assistant\backend\models\squat_cnn_model.h5",
        'lunge': r"C:\Users\MANIKANTA\pranvir-workout-assistant\backend\models\lunges_cnn_model.h5"
    }
    
    # MediaPipe settings
    MEDIAPIPE_MIN_DETECTION_CONFIDENCE = 0.5
    MEDIAPIPE_MIN_TRACKING_CONFIDENCE = 0.5
    
    # Image processing settings
    IMAGE_TARGET_SIZE = (224, 224)  # Standard size for CNN models

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False
    
    # In production, use environment variables
    SECRET_KEY = os.environ.get('SECRET_KEY')
    
    # Different model paths for production
    MODEL_PATHS = {
        'squat': '/app/models/squat_cnn_model.h5',
        'lunge': '/app/models/lunges_cnn_model.h5'
    }

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    DEBUG = True

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}