import cv2
import mediapipe as mp
import numpy as np

class MediaPipePoseDetector:
    def __init__(self, min_detection_confidence=0.5, min_tracking_confidence=0.5):
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(
            min_detection_confidence=min_detection_confidence,
            min_tracking_confidence=min_tracking_confidence
        )
        self.mp_drawing = mp.solutions.drawing_utils

    def detect_pose(self, image):
        """
        Detect pose landmarks in the image
        Returns: landmarks dictionary and annotated image
        """
        # Convert BGR to RGB
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image_rgb.flags.writeable = False
        
        # Make detection
        results = self.pose.process(image_rgb)
        
        # Convert back to BGR
        image_rgb.flags.writeable = True
        image_bgr = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2BGR)
        
        landmarks = {}
        if results.pose_landmarks:
            h, w, _ = image_bgr.shape
            for id, lm in enumerate(results.pose_landmarks.landmark):
                landmarks[self.mp_pose.PoseLandmark(id).name] = (int(lm.x * w), int(lm.y * h))
            
            # Draw pose landmarks
            self.mp_drawing.draw_landmarks(
                image_bgr, 
                results.pose_landmarks, 
                self.mp_pose.POSE_CONNECTIONS,
                self.mp_drawing.DrawingSpec(color=(245,117,66), thickness=2, circle_radius=2),
                self.mp_drawing.DrawingSpec(color=(245,66,230), thickness=2, circle_radius=2)
            )
        
        return landmarks, image_bgr

    def calculate_angle(self, a, b, c):
        """Calculate angle between three points"""
        a, b, c = np.array(a), np.array(b), np.array(c)
        radians = np.arctan2(c[1]-b[1], c[0]-b[0]) - np.arctan2(a[1]-b[1], a[0]-b[0])
        angle = np.abs(radians*180.0/np.pi)
        if angle > 180.0:
            angle = 360 - angle
        return angle

    def draw_feedback_on_image(self, image, feedback_list):
        """Draw feedback text on the image"""
        for i, feedback in enumerate(feedback_list):
            y_position = 50 + (i * 30)
            cv2.putText(image, feedback, (20, y_position), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2, cv2.LINE_AA)
        return image

    def release(self):
        """Release resources"""
        self.pose.close()

# For backward compatibility
def detect_pose(image):
    detector = MediaPipePoseDetector()
    landmarks, processed_image = detector.detect_pose(image)
    detector.release()
    return landmarks, processed_image