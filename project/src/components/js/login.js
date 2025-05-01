import React, { useState, useRef } from 'react';
import styles from '../css/login.module.css';
import backgroundImage from '../../assets/college.jpg';

const Login = () => {
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [isValidName, setIsValidName] = useState(true);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidRegNumber, setIsValidRegNumber] = useState(true);
  
  // Media states
  const [photo, setPhoto] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  
  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Validations
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setIsValidName(value.length >= 2);
  };

  const validateEmail = (e) => {
    const emailInput = e.target.value;
    setEmail(emailInput);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(emailInput) || emailInput === '');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRegNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setRegNumber(value);
      setIsValidRegNumber(value.length >= 6);
    }
  };

  // Media handlers
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setCameraActive(true);
    } catch (err) {
      console.error("Camera error:", err);
      setSubmitError("Could not access camera. Please check permissions.");
    }
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    
    canvas.toBlob((blob) => {
      setPhoto(URL.createObjectURL(blob));
      stopCamera();
    }, 'image/jpeg', 0.95);
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setPhoto(URL.createObjectURL(file));
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current);
        setAudioURL(URL.createObjectURL(audioBlob));
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone error:", err);
      setSubmitError("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess(false);

    // Validate all fields
    const isFormValid = isValidName && isValidEmail && isValidRegNumber && 
                       name && email && regNumber && password;
    
    if (!isFormValid) {
      if (!name) setIsValidName(false);
      if (!isValidEmail || !email) setIsValidEmail(false);
      if (!isValidRegNumber || !regNumber) setIsValidRegNumber(false);
      setSubmitError("Please fill all fields correctly");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('regNumber', regNumber);

      // Handle photo upload
      if (photo) {
        const photoBlob = await fetch(photo).then(r => r.blob());
        if (photoBlob.size > 5 * 1024 * 1024) {
          throw new Error("Photo must be less than 5MB");
        }
        formData.append('photo', photoBlob, 'profile.jpg');
      }

      // Handle audio upload
      if (audioURL) {
        const audioBlob = await fetch(audioURL).then(r => r.blob());
        if (audioBlob.size > 10 * 1024 * 1024) {
          throw new Error("Audio must be less than 10MB");
        }
        formData.append('voice', audioBlob, 'recording.webm');
      }

      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      // Reset form on success
      setName('');
      setEmail('');
      setPassword('');
      setRegNumber('');
      setPhoto(null);
      setAudioURL('');
      setSubmitSuccess(true);
    } catch (error) {
      console.error("Registration error:", error);
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.loginContainer} style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className={styles.transparentBox}>
        <h2 className={styles.title}>Create Your Account</h2>
        
        {submitError && (
          <div className={styles.errorMessage}>{submitError}</div>
        )}
        
        {submitSuccess && (
          <div className={styles.successMessage}>Registration successful!</div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Name Field */}
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your full name"
              value={name}
              onChange={handleNameChange}
              className={`${styles.input} ${!isValidName ? styles.error : ''}`}
              required
            />
            {!isValidName && (
              <span className={styles.errorMessage}>
                {name ? 'Name must be at least 2 characters' : 'Name is required'}
              </span>
            )}
          </div>

          {/* Registration Number Field */}
          <div className={styles.formGroup}>
            <label htmlFor="regNumber">Registration Number</label>
            <input
              type="text"
              id="regNumber"
              placeholder="Enter registration number (numbers only)"
              value={regNumber}
              onChange={handleRegNumberChange}
              className={`${styles.input} ${!isValidRegNumber ? styles.error : ''}`}
              required
              pattern="\d*"
              inputMode="numeric"
            />
            {!isValidRegNumber && (
              <span className={styles.errorMessage}>
                {regNumber ? 'Must be at least 6 digits' : 'Registration number is required'}
              </span>
            )}
          </div>

          {/* Email Field */}
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={validateEmail}
              className={`${styles.input} ${!isValidEmail ? styles.error : ''}`}
              required
            />
            {!isValidEmail && (
              <span className={styles.errorMessage}>Please enter a valid email</span>
            )}
          </div>

          {/* Password Field */}
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Create a password (min 6 characters)"
              value={password}
              onChange={handlePasswordChange}
              className={styles.input}
              required
              minLength="6"
            />
          </div>

          {/* Media Sections */}
          <div className={styles.mediaSection}>
            {/* Photo Section */}
            <div className={styles.photoContainer}>
              <h3 className={styles.sectionTitle}>Profile Photo</h3>
              <div className={styles.mediaPreview}>
                {photo ? (
                  <img src={photo} alt="Profile preview" className={styles.previewImage} />
                ) : (
                  <video 
                    ref={videoRef} 
                    className={styles.previewVideo}
                    style={{ display: cameraActive ? 'block' : 'none' }}
                  />
                )}
                {!photo && !cameraActive && (
                  <div className={styles.placeholder}>
                    {isSubmitting ? 'Uploading...' : 'No photo selected'}
                  </div>
                )}
              </div>
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <div className={styles.buttonColumn}>
                {!photo ? (
                  <>
                    {!cameraActive ? (
                      <>
                        <button 
                          type="button" 
                          onClick={startCamera} 
                          className={styles.mediaButton}
                          disabled={isSubmitting}
                        >
                          Use Camera
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={handleFileUpload}
                          style={{ display: 'none' }}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current.click()}
                          className={styles.mediaButton}
                          disabled={isSubmitting}
                        >
                          Upload Photo
                        </button>
                      </>
                    ) : (
                      <button 
                        type="button" 
                        onClick={takePhoto} 
                        className={styles.mediaButton}
                      >
                        Take Photo
                      </button>
                    )}
                  </>
                ) : (
                  <button 
                    type="button" 
                    onClick={() => setPhoto(null)} 
                    className={styles.mediaButton}
                    disabled={isSubmitting}
                  >
                    Change Photo
                  </button>
                )}
              </div>
            </div>

            {/* Voice Recording Section */}
            <div className={styles.voiceContainer}>
              <h3 className={styles.sectionTitle}>Voice Verification</h3>
              <div className={styles.mediaPreview}>
                {audioURL ? (
                  <audio controls src={audioURL} className={styles.audioPlayer} />
                ) : (
                  <div className={styles.placeholder}>
                    {isRecording ? 'Recording...' : 'No recording'}
                  </div>
                )}
              </div>
              <div className={styles.buttonColumn}>
                {!isRecording ? (
                  <button 
                    type="button" 
                    onClick={startRecording} 
                    className={styles.mediaButton}
                    disabled={isSubmitting}
                  >
                    Start Recording
                  </button>
                ) : (
                  <button 
                    type="button" 
                    onClick={stopRecording} 
                    className={styles.mediaButton}
                  >
                    Stop Recording
                  </button>
                )}
                {audioURL && (
                  <button 
                    type="button" 
                    onClick={() => setAudioURL('')} 
                    className={styles.mediaButton}
                    disabled={isSubmitting}
                  >
                    Re-record
                  </button>
                )}
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className={styles.spinner}></span>
                Processing...
              </>
            ) : (
              'Complete Registration'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;