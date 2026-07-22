import cv2
import mediapipe as mp
import numpy as np
from tensorflow.keras.models import load_model
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ExerciseClassifier:
    def __init__(self):
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)
        
        # Load your combined model
        self.model_path = r"C:\Users\MANIKANTA\pranvir-workout-assistant\backend\models\motion_classifier.h5"

        self.model_loaded = False
        self.img_size = (128, 128)  # Must match dataset preprocessing

        try:
            logger.info(f"Loading combined model from: {self.model_path}")
            self.model = load_model(self.model_path)
            self.model_loaded = True
            logger.info("✅ Combined motion model loaded successfully!")
        except Exception as e:
            logger.error(f"❌ Failed to load model: {e}")
            self.model = None
            self.model_loaded = False

        # Class labels for motion stages (0-3)
        self.class_labels = ['0', '1', '2', '3']

    def preprocess_image(self, image_path):
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError(f"Cannot read image: {image_path}")
        img = cv2.resize(img, self.img_size)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = img.astype(np.float32) / 255.0
        return np.expand_dims(img, axis=0)

    def calculate_angle(self, a, b, c):
        """Calculate angle between three points"""
        a, b, c = np.array(a), np.array(b), np.array(c)
        radians = np.arctan2(c[1]-b[1], c[0]-b[0]) - np.arctan2(a[1]-b[1], a[0]-b[0])
        angle = np.abs(radians*180.0/np.pi)
        if angle > 180.0:
            angle = 360 - angle
        return angle

    # Keep your existing posture feedback functions
    def get_squat_feedback(self, landmarks):
        # ... same as your previous function ...
        return []  # Keep previous logic here

    def get_lunge_feedback(self, landmarks):
        # ... same as your previous function ...
        return []  # Keep previous logic here

    def classify_exercise(self, image_path, exercise_type=None):
        """
        Predict motion stage (0-3) for given frame.
        Optionally returns exercise_type for frontend display.
        """
        try:
            if not self.model_loaded:
                return {
                    'exercise': exercise_type if exercise_type else "unknown",
                    'prediction': 'demo_analysis',
                    'confidence': 0.78,
                    'status': 'demo',
                    'feedback': ["Model not loaded, running demo feedback"]
                }

            # Preprocess image
            img = self.preprocess_image(image_path)
            preds = self.model.predict(img, verbose=0)
            class_idx = int(np.argmax(preds))
            confidence = float(np.max(preds))

            return {
                'exercise': exercise_type if exercise_type else "unknown",
                'stage': self.class_labels[class_idx],
                'confidence': round(confidence, 3),
                'status': 'success'
            }

        except Exception as e:
            return {
                "exercise": exercise_type if exercise_type else "unknown",
                "error": str(e)
            }
