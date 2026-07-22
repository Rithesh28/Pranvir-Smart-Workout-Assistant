// Exercise management and image analysis
class ExerciseManager {
    constructor() {
        this.selectedExercise = 'squat';
        this.uploadedImage = null;
        this.init();
    }

    init() {
        this.initializeExerciseSelection();
        this.initializeImageUpload();
        this.initializeAnalysis();
        this.loadExerciseInfo();
    }

    initializeExerciseSelection() {
        // Exercise selection buttons
        document.querySelectorAll('.exercise-select-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const exercise = e.target.closest('.exercise-card').dataset.exercise;
                this.selectExercise(exercise);
            });
        });

        // Radio buttons for upload analysis
        document.querySelectorAll('input[name="exerciseType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.selectedExercise = e.target.value;
                this.updateAnalysisButton();
            });
        });
    }

    initializeImageUpload() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('imageInput');

        if (!uploadArea || !fileInput) return;

        // Click to upload
        uploadArea.addEventListener('click', () => fileInput.click());

        // File input change
        fileInput.addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files[0]);
        });

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            this.handleFileSelect(e.dataTransfer.files[0]);
        });
    }

    initializeAnalysis() {
        const analyzeBtn = document.getElementById('analyzeBtn');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => this.analyzeImage());
        }
    }

    async selectExercise(exerciseType) {
        this.selectedExercise = exerciseType;
        
        // Update UI
        document.querySelectorAll('.exercise-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        const selectedCard = document.querySelector(`[data-exercise="${exerciseType}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }

        // Load exercise info
        await this.loadExerciseInfo(exerciseType);
        
        // Show success feedback
        this.showExerciseFeedback(`${exerciseType.charAt(0).toUpperCase() + exerciseType.slice(1)} selected!`);
    }

    handleFileSelect(file) {
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            this.showError('Please select a valid image file (JPEG, PNG, GIF)');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            this.showError('Image size must be less than 10MB');
            return;
        }

        this.uploadedImage = file;
        this.previewImage(file);
        this.updateAnalysisButton();
    }

    previewImage(file) {
        const reader = new FileReader();
        const uploadArea = document.getElementById('uploadArea');

        reader.onload = (e) => {
            uploadArea.innerHTML = `
                <div class="image-preview">
                    <img src="${e.target.result}" alt="Preview">
                    <div class="preview-overlay">
                        <button class="change-image-btn" onclick="exerciseManager.changeImage()">
                            <i class="fas fa-sync-alt"></i> Change Image
                        </button>
                    </div>
                </div>
            `;
        };

        reader.readAsDataURL(file);
    }

    changeImage() {
        this.uploadedImage = null;
        const uploadArea = document.getElementById('uploadArea');
        uploadArea.innerHTML = `
            <div class="upload-content">
                <i class="fas fa-cloud-upload-alt"></i>
                <h3>Drop your image here</h3>
                <p>or click to browse</p>
                <span class="file-types">Supports: JPG, PNG, GIF</span>
            </div>
        `;
        this.updateAnalysisButton();
    }

    updateAnalysisButton() {
        const analyzeBtn = document.getElementById('analyzeBtn');
        if (analyzeBtn) {
            analyzeBtn.disabled = !this.uploadedImage;
        }
    }

    async analyzeImage() {
        if (!this.uploadedImage) return;

        const analyzeBtn = document.getElementById('analyzeBtn');
        this.setLoadingState(analyzeBtn, true);

        try {
            const formData = new FormData();
            formData.append('image', this.uploadedImage);
            formData.append('exercise_type', this.selectedExercise);

            const response = await fetch('/analyze_exercise', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                this.displayResults(result);
            } else {
                throw new Error(result.error || 'Analysis failed');
            }

        } catch (error) {
            this.showError(error.message);
        } finally {
            this.setLoadingState(analyzeBtn, false);
        }
    }

    displayResults(result) {
        const resultsSection = document.getElementById('resultsSection');
        const resultImage = document.getElementById('resultImage');
        const exerciseBadge = document.getElementById('exerciseBadge');
        const confidenceScore = document.getElementById('confidenceScore');
        const predictionResult = document.getElementById('predictionResult');
        const feedbackList = document.getElementById('feedbackList');

        // Update results
        resultImage.src = result.image_url;
        exerciseBadge.textContent = result.exercise.charAt(0).toUpperCase() + result.exercise.slice(1);
        confidenceScore.textContent = `${Math.round(result.result.confidence * 100)}%`;
        
        // Format prediction result
        const prediction = result.result.prediction;
        predictionResult.textContent = this.formatPrediction(prediction, result.exercise);
        predictionResult.className = `prediction-result ${this.getPredictionClass(prediction)}`;

        // Generate feedback
        this.generateFeedback(feedbackList, result);

        // Show results section
        resultsSection.style.display = 'block';
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    formatPrediction(prediction, exercise) {
        const predictions = {
            squat: {
                correct: 'Perfect squat form! 🎉',
                incorrect: 'Form needs adjustment',
                model_not_loaded: 'Squat model not available'
            },
            lunge: {
                up: 'Good lunge position! 👍',
                down: 'Deep lunge detected',
                model_not_loaded: 'Lunge model not available'
            }
        };

        return predictions[exercise]?.[prediction] || `Prediction: ${prediction}`;
    }

    getPredictionClass(prediction) {
        const positivePredictions = ['correct', 'up', 'down'];
        return positivePredictions.includes(prediction) ? 'positive' : 'negative';
    }

    generateFeedback(container, result) {
        // Clear existing feedback
        container.innerHTML = '';

        // Generate feedback based on prediction and confidence
        const feedbackItems = this.generateFeedbackItems(result);
        
        feedbackItems.forEach(feedback => {
            const feedbackItem = document.createElement('div');
            feedbackItem.className = `feedback-item ${feedback.type}`;
            feedbackItem.innerHTML = `
                <i class="fas ${feedback.icon}"></i>
                <span>${feedback.message}</span>
            `;
            container.appendChild(feedbackItem);
        });

        // Add confidence feedback
        if (result.result.confidence < 0.7) {
            const confidenceFeedback = document.createElement('div');
            confidenceFeedback.className = 'feedback-item warning';
            confidenceFeedback.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <span>Low confidence score. Please ensure good lighting and clear posture.</span>
            `;
            container.appendChild(confidenceFeedback);
        }
    }

    generateFeedbackItems(result) {
        const feedback = [];
        const confidence = result.result.confidence;

        // Base feedback on prediction
        if (result.result.prediction === 'correct' || result.result.prediction === 'up') {
            feedback.push({
                type: 'success',
                icon: 'fa-check-circle',
                message: 'Excellent form! Your posture looks great.'
            });
        } else {
            feedback.push({
                type: 'warning',
                icon: 'fa-exclamation-triangle',
                message: 'Form needs improvement. Check the suggestions below.'
            });
        }

        // Confidence-based feedback
        if (confidence > 0.9) {
            feedback.push({
                type: 'success',
                icon: 'fa-star',
                message: 'High confidence analysis - very reliable results!'
            });
        }

        // Exercise-specific tips
        if (result.exercise === 'squat') {
            feedback.push({
                type: 'info',
                icon: 'fa-lightbulb',
                message: 'Keep your back straight and chest up during squats.'
            });
        } else if (result.exercise === 'lunge') {
            feedback.push({
                type: 'info',
                icon: 'fa-lightbulb',
                message: 'Ensure your front knee stays behind your toes in lunges.'
            });
        }

        return feedback;
    }

    async loadExerciseInfo(exerciseType = 'squat') {
        try {
            const response = await fetch(`/get_exercise_info/${exerciseType}`);
            const info = await response.json();

            // Update exercise card with detailed info
            this.updateExerciseCard(exerciseType, info);

        } catch (error) {
            console.error('Failed to load exercise info:', error);
        }
    }

    updateExerciseCard(exerciseType, info) {
        const card = document.querySelector(`[data-exercise="${exerciseType}"]`);
        if (!card) return;

        // Update description if available
        const descriptionEl = card.querySelector('.exercise-description');
        if (descriptionEl && info.description) {
            descriptionEl.textContent = info.description;
        }

        // Update muscles if available
        const musclesEl = card.querySelector('.exercise-muscles');
        if (musclesEl && info.muscles) {
            musclesEl.innerHTML = info.muscles.map(muscle => 
                `<span class="muscle-tag">${muscle}</span>`
            ).join('');
        }
    }

    setLoadingState(button, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
        } else {
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-search"></i> Analyze Image';
        }
    }

    showExerciseFeedback(message) {
        // Create temporary feedback element
        const feedback = document.createElement('div');
        feedback.className = 'exercise-feedback';
        feedback.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--success);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;
        feedback.innerHTML = `
            <i class="fas fa-check-circle"></i> ${message}
        `;

        document.body.appendChild(feedback);

        setTimeout(() => {
            feedback.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => feedback.remove(), 300);
        }, 3000);
    }

    showError(message) {
        // Remove existing errors
        const existingErrors = document.querySelectorAll('.analysis-error');
        existingErrors.forEach(error => error.remove());

        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'analysis-error error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            ${message}
        `;

        const uploadContainer = document.querySelector('.upload-container');
        uploadContainer.appendChild(errorDiv);

        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .exercise-card.selected {
        border-color: var(--primary);
        box-shadow: 0 10px 30px rgba(255, 107, 53, 0.2);
    }
    
    .image-preview {
        position: relative;
        width: 100%;
        height: 200px;
        border-radius: 10px;
        overflow: hidden;
    }
    
    .image-preview img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .preview-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .image-preview:hover .preview-overlay {
        opacity: 1;
    }
    
    .change-image-btn {
        background: var(--primary);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .prediction-result.positive {
        color: var(--success);
    }
    
    .prediction-result.negative {
        color: var(--warning);
    }
`;
document.head.appendChild(style);

// Initialize exercise manager
let exerciseManager;

document.addEventListener('DOMContentLoaded', function() {
    exerciseManager = new ExerciseManager();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExerciseManager;
}