import os
import cv2
import numpy as np
from flask import Flask, render_template, request, jsonify, redirect, url_for, session, send_from_directory
from werkzeug.utils import secure_filename
from models.pose_classifier import ExerciseClassifier

# Get the absolute path to the project root
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
STATIC_FOLDER = os.path.join(PROJECT_ROOT, 'static')
TEMPLATE_FOLDER = os.path.join(BASE_DIR, 'templates')

app = Flask(
    __name__, 
    static_folder=STATIC_FOLDER,
    static_url_path='/static',
    template_folder=TEMPLATE_FOLDER
)

app.secret_key = 'pranvir-smart-workout-secret-key-2024'
app.config['UPLOAD_FOLDER'] = os.path.join(STATIC_FOLDER, 'uploads')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Initialize the exercise classifier (single combined model)
classifier = ExerciseClassifier()

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Manual static file routes
@app.route('/css/<path:filename>')
def serve_css(filename):
    return send_from_directory(os.path.join(STATIC_FOLDER, 'css'), filename)

@app.route('/js/<path:filename>')
def serve_js(filename):
    return send_from_directory(os.path.join(STATIC_FOLDER, 'js'), filename)

@app.route('/images/<path:filename>')
def serve_images(filename):
    return send_from_directory(os.path.join(STATIC_FOLDER, 'images'), filename)

# Home page
@app.route('/')
def home():
    return render_template('index.html')

# Login system
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        if email and password:
            session['user'] = email
            return redirect(url_for('dashboard'))
        else:
            return render_template('login.html', error='Please enter both email and password')
    return render_template('login.html')

@app.route('/dashboard')
def dashboard():
    if 'user' not in session:
        return redirect(url_for('login'))
    return render_template('dashboard.html', username=session['user'])

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('home'))

# Analyze exercise (image upload)
@app.route('/analyze_exercise', methods=['POST'])
def analyze_exercise():
    if 'user' not in session:
        return jsonify({'error': 'Please login first'}), 401
    
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
    
    file = request.files['image']
    exercise_type = request.form.get('exercise_type', 'unknown')  # optional, just for display
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # Use the updated classifier with single model
            result = classifier.classify_exercise(filepath, exercise_type)
            
            return jsonify({
                'success': True,
                'exercise': exercise_type,
                'result': result,
                'image_url': f'/uploads/{filename}'
            })
        except Exception as e:
            return jsonify({'error': f'Analysis failed: {str(e)}'}), 500
    
    return jsonify({'error': 'Invalid file type'}), 400

# Uploads serving
@app.route('/uploads/<path:filename>')
def serve_upload(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Exercise info API
@app.route('/get_exercise_info/<exercise_type>')
def get_exercise_info(exercise_type):
    exercise_info = {
        'squat': {
            'name': 'Squat',
            'description': 'Squats are a fundamental lower body exercise that targets your quadriceps, hamstrings, and glutes.',
            'muscles': ['Quadriceps', 'Hamstrings', 'Glutes', 'Core'],
            'difficulty': 'Beginner',
            'steps': [
                'Stand with feet shoulder-width apart',
                'Keep your back straight and chest up',
                'Lower your body as if sitting in a chair',
                'Go down until thighs are parallel to ground',
                'Push through heels to return to start'
            ]
        },
        'lunge': {
            'name': 'Lunge',
            'description': 'Lunges are excellent for unilateral leg strength and balance.',
            'muscles': ['Glutes', 'Quadriceps', 'Hamstrings', 'Calves'],
            'difficulty': 'Intermediate',
            'steps': [
                'Stand with feet together',
                'Step forward with one leg',
                'Lower hips until both knees are bent at 90°',
                'Keep front knee behind toes',
                'Push back to starting position'
            ]
        }
    }
    if exercise_type in exercise_info:
        return jsonify(exercise_info[exercise_type])
    else:
        return jsonify({'error': 'Exercise not found'}), 404

# Debug routes
@app.route('/debug')
def debug():
    return jsonify({
        'project_root': PROJECT_ROOT,
        'static_folder': STATIC_FOLDER,
        'template_folder': TEMPLATE_FOLDER,
        'css_exists': os.path.exists(os.path.join(STATIC_FOLDER, 'css', 'style.css')),
        'js_exists': os.path.exists(os.path.join(STATIC_FOLDER, 'js', 'main.js')),
    })

@app.route('/debug_login')
def debug_login():
    return render_template('login.html')

@app.route('/test_login')
def test_login():
    return render_template('login.html')

@app.route('/test_static')
def test_static():
    return render_template('test_static.html')

if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    print("🚀 Starting Pranvir - Smart Workout Assistant")
    print(f"📁 Static files from: {STATIC_FOLDER}")
    print(f"📁 Templates from: {TEMPLATE_FOLDER}")
    print("🌐 Server running on: http://localhost:5000")
    app.run(debug=True, port=5000)
