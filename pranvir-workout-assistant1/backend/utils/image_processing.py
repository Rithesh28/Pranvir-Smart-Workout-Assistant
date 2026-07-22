import cv2
import numpy as np
import os
from werkzeug.utils import secure_filename

class ImageProcessor:
    def __init__(self, upload_folder='static/uploads'):
        self.upload_folder = upload_folder
        os.makedirs(upload_folder, exist_ok=True)

    def preprocess_image(self, image_path, target_size=(224, 224)):
        """
        Preprocess image for model prediction
        """
        try:
            # Read image
            image = cv2.imread(image_path)
            if image is None:
                raise ValueError("Could not read image")
            
            # Resize image
            processed_image = cv2.resize(image, target_size)
            
            # Normalize pixel values
            processed_image = processed_image.astype('float32') / 255.0
            
            # Expand dimensions for model input
            processed_image = np.expand_dims(processed_image, axis=0)
            
            return processed_image
            
        except Exception as e:
            raise Exception(f"Image preprocessing failed: {str(e)}")

    def save_uploaded_image(self, file):
        """
        Save uploaded file securely
        """
        if file and self.allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(self.upload_folder, filename)
            file.save(filepath)
            return filepath
        return None

    def allowed_file(self, filename):
        """
        Check if file extension is allowed
        """
        allowed_extensions = {'png', 'jpg', 'jpeg', 'gif'}
        return '.' in filename and \
               filename.rsplit('.', 1)[1].lower() in allowed_extensions

    def validate_image(self, image_path, max_size_mb=10):
        """
        Validate image size and format
        """
        try:
            # Check file size
            file_size = os.path.getsize(image_path) / (1024 * 1024)  # MB
            if file_size > max_size_mb:
                return False, f"Image size exceeds {max_size_mb}MB limit"
            
            # Check if image can be read
            image = cv2.imread(image_path)
            if image is None:
                return False, "Invalid image file"
            
            return True, "Valid image"
            
        except Exception as e:
            return False, f"Validation error: {str(e)}"

    def draw_pose_polygons(self, image, landmarks):
        """
        Draw polygons on pose landmarks (similar to your original code)
        """
        def draw_polygon(img, points, color=(0, 255, 0), thickness=2, fill_color=(0, 255, 0, 50)):
            if len(points) > 2:
                pts = np.array(points, np.int32).reshape((-1, 1, 2))
                overlay = img.copy()
                cv2.fillPoly(overlay, [pts], fill_color[:3])
                alpha = 0.2
                cv2.addWeighted(overlay, alpha, img, 1 - alpha, 0, img)
                cv2.polylines(img, [pts], True, color, thickness)
        
        try:
            # Draw polygons for different body parts
            if all(k in landmarks for k in ['LEFT_SHOULDER', 'RIGHT_SHOULDER', 'RIGHT_HIP', 'LEFT_HIP']):
                draw_polygon(image, [
                    landmarks['LEFT_SHOULDER'], landmarks['RIGHT_SHOULDER'],
                    landmarks['RIGHT_HIP'], landmarks['LEFT_HIP']
                ], color=(0, 255, 0))
            
            if all(k in landmarks for k in ['LEFT_HIP', 'LEFT_KNEE', 'LEFT_ANKLE']):
                draw_polygon(image, [
                    landmarks['LEFT_HIP'], landmarks['LEFT_KNEE'], landmarks['LEFT_ANKLE']
                ], color=(255, 0, 0))
            
            if all(k in landmarks for k in ['RIGHT_HIP', 'RIGHT_KNEE', 'RIGHT_ANKLE']):
                draw_polygon(image, [
                    landmarks['RIGHT_HIP'], landmarks['RIGHT_KNEE'], landmarks['RIGHT_ANKLE']
                ], color=(0, 0, 255))
            
            return image
            
        except Exception as e:
            print(f"Error drawing polygons: {e}")
            return image

    def create_analysis_visualization(self, image_path, landmarks, feedback, prediction):
        """
        Create a visualization image with pose detection and feedback
        """
        try:
            image = cv2.imread(image_path)
            if image is None:
                return None
            
            # Draw pose landmarks and polygons
            if landmarks:
                image = self.draw_pose_polygons(image, landmarks)
            
            # Add prediction text
            cv2.putText(image, f'Prediction: {prediction}', (20, 30), 
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
            
            # Add feedback
            for i, fb in enumerate(feedback):
                y_position = 70 + (i * 25)
                cv2.putText(image, fb, (20, y_position), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2, cv2.LINE_AA)
            
            return image
            
        except Exception as e:
            print(f"Visualization error: {e}")
            return None