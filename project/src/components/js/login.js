import React, { useState, useRef } from 'react';
import styles from '../css/login.module.css';
import backgroundImage from '../../assets/college.jpg'; // Make sure to add your image






const Login = () => {
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [isValidName, setIsValidName] = useState(true);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidRegNumber, setIsValidRegNumber] = useState(true);
  
  // Photo capture states
  const [photo, setPhoto] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  
  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  
  // Refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const isFormValid = isValidName && isValidEmail && isValidRegNumber && 
                       name && email && regNumber && password;
    
    if (!isFormValid) {
      if (!name) setIsValidName(false);
      if (!isValidEmail || !email) setIsValidEmail(false);
      if (!isValidRegNumber || !regNumber) setIsValidRegNumber(false);
      alert("Please fill all fields correctly");
      return;
    }
    
    // Prepare form data
    const formData = {
      name,
      email,
      password,
      regNumber,
      photo,
      audioURL
    };
    
    console.log("Form submitted:", formData);
    alert("Registration successful!");
  };

  // Name validation
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setIsValidName(value.length >= 2); // At least 2 characters
  };

  // Email validation
  const validateEmail = (e) => {
    const emailInput = e.target.value;
    setEmail(emailInput);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(emailInput) || emailInput === '');
  };

  // Password handler
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Registration number handler
  const handleRegNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setRegNumber(value);
      setIsValidRegNumber(value.length >= 6);
    }
  };

  // Camera functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setCameraActive(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check permissions.");
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

  // Voice recording functions
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
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <div className={styles.loginContainer} style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className={styles.transparentBox}>
        <h2 className={styles.title}>Create Your Account</h2>
        
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
              placeholder="Create a password"
              value={password}
              onChange={handlePasswordChange}
              className={styles.input}
              required
              minLength="6"
            />
          </div>

          {/* Photo Section */}
          <div className={styles.mediaSection}>
            <div className={styles.photoContainer}>
              <h3 className={styles.sectionTitle}>Profile Photo</h3>
              <div className={styles.mediaPreview}>
                {photo ? (
                  <img src={photo} alt="Captured" className={styles.previewImage} />
                ) : (
                  <video 
                    ref={videoRef} 
                    className={styles.previewVideo}
                    style={{ display: cameraActive ? 'block' : 'none' }}
                  />
                )}
                {!photo && !cameraActive && (
                  <div className={styles.placeholder}>Camera inactive</div>
                )}
              </div>
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <div className={styles.buttonColumn}>
                {!photo ? (
                  <>
                    {!cameraActive ? (
                      <button type="button" onClick={startCamera} className={styles.mediaButton}>
                        Start Camera
                      </button>
                    ) : (
                      <button type="button" onClick={takePhoto} className={styles.mediaButton}>
                        Take Photo
                      </button>
                    )}
                  </>
                ) : (
                  <button type="button" onClick={() => setPhoto(null)} className={styles.mediaButton}>
                    Retake Photo
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
                  <button type="button" onClick={startRecording} className={styles.mediaButton}>
                    Start Recording
                  </button>
                ) : (
                  <button type="button" onClick={stopRecording} className={styles.mediaButton}>
                    Stop Recording
                  </button>
                )}
                {audioURL && (
                  <button type="button" onClick={() => setAudioURL('')} className={styles.mediaButton}>
                    Re-record
                  </button>
                )}
              </div>
            </div>
          </div>

          <button type="submit" className={styles.submitButton}>
            Complete Registration
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;