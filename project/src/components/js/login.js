import React, { useState, useRef, useEffect } from "react";
import styles from "../css/login.module.css";
import backgroundImage from "../../assets/college.jpg";

const Login = () => {
  // Form states
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [isValidName, setIsValidName] = useState(true);
  const [isValidRegNumber, setIsValidRegNumber] = useState(true);

  // Permission states
  const [cameraPermission, setCameraPermission] = useState(null);
  const [microphonePermission, setMicrophonePermission] = useState(null);

  // Media states - now using individual states for each photo
  const [photos, setPhotos] = useState({
    photo1: null,
    photo2: null,
    photo3: null,
    photo4: null,
    photo5: null,
  });
  const [cameraActive, setCameraActive] = useState(false);
  const [isRecording, setIsRecording] = useState({
    recording1: false,
    recording2: false,
    recording3: false,
  });
  const [audioURLs, setAudioURLs] = useState({
    recording1: "",
    recording2: "",
    recording3: "",
  });

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Refs
  const mediaRecorderRefs = useRef({
    recording1: null,
    recording2: null,
    recording3: null,
  });
  const audioChunksRefs = useRef({
    recording1: [],
    recording2: [],
    recording3: [],
  });
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Check permissions
  const checkPermissions = async () => {
    try {
      if (navigator.permissions && navigator.permissions.query) {
        // Check camera permission
        const cameraStatus = await navigator.permissions.query({
          name: "camera",
        });
        setCameraPermission(cameraStatus.state);
        cameraStatus.onchange = () => setCameraPermission(cameraStatus.state);

        // Check microphone permission
        const micStatus = await navigator.permissions.query({
          name: "microphone",
        });
        setMicrophonePermission(micStatus.state);
        micStatus.onchange = () => setMicrophonePermission(micStatus.state);
      }
    } catch (error) {
      console.log(
        "Permission API not supported, falling back to default behavior"
      );
    }
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  // Mobile detection
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  // Camera functions
  const startCamera = async () => {
    try {
      setSubmitError("");
      const constraints = {
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices
        .getUserMedia(constraints)
        .catch((err) => {
          if (err.name === "NotAllowedError") {
            setSubmitError(
              "Camera permission was denied. Please allow camera access."
            );
            setCameraPermission("denied");
          }
          throw err;
        });

      videoRef.current.srcObject = stream;
      videoRef.current.play();

      if (isMobile()) {
        videoRef.current.setAttribute("playsinline", "");
        videoRef.current.setAttribute("webkit-playsinline", "");
      }

      setCameraActive(true);
      setCameraPermission("granted");
    } catch (err) {
      console.error("Camera error:", err);
      if (!err.message.includes("denied")) {
        setSubmitError("Could not access camera. Please check permissions.");
      }
    }
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (isMobile()) {
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (isMobile()) {
      context.setTransform(1, 0, 0, 1, 0, 0);
    }

    canvas.toBlob(
      (blob) => {
        const photoURL = URL.createObjectURL(blob);
        // Find the first empty photo slot
        const emptySlot = Object.entries(photos).find(
          ([_, value]) => !value
        )?.[0];
        if (emptySlot) {
          setPhotos((prev) => ({
            ...prev,
            [emptySlot]: photoURL,
          }));
        }

        // Stop camera if all photos are taken
        if (Object.values(photos).filter(Boolean).length + 1 >= 5) {
          stopCamera();
        }
      },
      "image/jpeg",
      0.95
    );
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      setCameraActive(false);
    }
  };

  // Audio recording functions
  const startRecording = async (recordingId) => {
    try {
      setSubmitError("");

      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      };

      const stream = await navigator.mediaDevices
        .getUserMedia(constraints)
        .catch((err) => {
          if (err.name === "NotAllowedError") {
            setSubmitError(
              "Microphone permission was denied. Please allow microphone access."
            );
            setMicrophonePermission("denied");
          }
          throw err;
        });

      mediaRecorderRefs.current[recordingId] = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      audioChunksRefs.current[recordingId] = [];

      mediaRecorderRefs.current[recordingId].ondataavailable = (e) => {
        audioChunksRefs.current[recordingId].push(e.data);
      };

      mediaRecorderRefs.current[recordingId].onstop = () => {
        const audioBlob = new Blob(audioChunksRefs.current[recordingId], {
          type: "audio/webm",
        });
        setAudioURLs((prev) => ({
          ...prev,
          [recordingId]: URL.createObjectURL(audioBlob),
        }));
      };

      mediaRecorderRefs.current[recordingId].start(100);
      setIsRecording((prev) => ({
        ...prev,
        [recordingId]: true,
      }));
      setMicrophonePermission("granted");
    } catch (err) {
      console.error("Recording error:", err);
      if (!err.message.includes("denied")) {
        setSubmitError(
          "Could not access microphone. Please check permissions."
        );
      }
    }
  };

  const stopRecording = (recordingId) => {
    if (mediaRecorderRefs.current[recordingId]) {
      mediaRecorderRefs.current[recordingId].stop();
      mediaRecorderRefs.current[recordingId].stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording((prev) => ({
        ...prev,
        [recordingId]: false,
      }));
    }
  };

  const clearRecording = (recordingId) => {
    setAudioURLs((prev) => ({
      ...prev,
      [recordingId]: "",
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const emptySlots = Object.entries(photos)
      .filter(([_, value]) => !value)
      .map(([key]) => key)
      .slice(0, files.length);

    emptySlots.forEach((slot, index) => {
      const file = files[index];
      if (file && file.type.startsWith("image/")) {
        const photoURL = URL.createObjectURL(file);
        setPhotos((prev) => ({
          ...prev,
          [slot]: photoURL,
        }));
      }
    });
  };

  const removePhoto = (photoId) => {
    setPhotos((prev) => ({
      ...prev,
      [photoId]: null,
    }));
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setIsValidName(value.length >= 2);
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

  // Count how many photos have been uploaded
  const photoCount = Object.values(photos).filter(Boolean).length;

  // Form submission - updated for individual photos and voice samples
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess(false);

    // Validate all fields
    const isFormValid =
      isValidName && isValidRegNumber && name && regNumber && password;

    if (!isFormValid) {
      if (!name) setIsValidName(false);
      if (!isValidRegNumber || !regNumber) setIsValidRegNumber(false);
      setSubmitError("Please fill all fields correctly");
      return;
    }

    // Validate photos
    if (photoCount < 5) {
      setSubmitError("Please upload exactly 5 photos");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("password", password);
      formData.append("regNumber", regNumber);

      // Handle photo uploads - each photo individually
      for (const [photoId, photoURL] of Object.entries(photos)) {
        if (photoURL) {
          const photoBlob = await fetch(photoURL).then((r) => r.blob());
          if (photoBlob.size > 5 * 1024 * 1024) {
            throw new Error(`Photo ${photoId} must be less than 5MB`);
          }
          formData.append(photoId, photoBlob, `${photoId}.jpg`);
        }
      }

      // Handle audio uploads - each recording individually
      for (const [recordingId, url] of Object.entries(audioURLs)) {
        if (url) {
          const audioBlob = await fetch(url).then((r) => r.blob());
          if (audioBlob.size > 10 * 1024 * 1024) {
            throw new Error(`Audio ${recordingId} must be less than 10MB`);
          }
          formData.append(recordingId, audioBlob, `${recordingId}.webm`);
        }
      }

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      // Reset form on success
      setName("");
      setPassword("");
      setRegNumber("");
      setPhotos({
        photo1: null,
        photo2: null,
        photo3: null,
        photo4: null,
        photo5: null,
      });
      setAudioURLs({
        recording1: "",
        recording2: "",
        recording3: "",
      });
      setSubmitSuccess(true);
    } catch (error) {
      console.error("Registration error:", error);
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={styles.loginContainer}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
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
              className={`${styles.input} ${!isValidName ? styles.error : ""}`}
              required
            />
            {!isValidName && (
              <span className={styles.errorMessage}>
                {name
                  ? "Name must be at least 2 characters"
                  : "Name is required"}
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
              className={`${styles.input} ${
                !isValidRegNumber ? styles.error : ""
              }`}
              required
              pattern="\d*"
              inputMode="numeric"
            />
            {!isValidRegNumber && (
              <span className={styles.errorMessage}>
                {regNumber
                  ? "Must be at least 6 digits"
                  : "Registration number is required"}
              </span>
            )}
          </div>

          {/* Password Field */}
          <div className={styles.formGroup}>
            <label htmlFor="password">Pincode</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your portal pincode"
              value={password}
              onChange={handlePasswordChange}
              className={styles.input}
              required
              minLength="6"
            />
          </div>

          {/* Media Sections */}
          <div className={styles.mediaSection}>
            {/* Photo Section - updated for individual photos */}
            <div className={styles.photoContainer}>
              <h3 className={styles.sectionTitle}>
                Profile Photos ({photoCount}/5)
              </h3>
              <h4>
                Instructions: We're gonna need 5 images (all with a plain
                background), 2 with good lighting, 1 with dim lighting, 1 left
                side profile, 1 right side profile.
              </h4>

              {/* Photo preview grid */}
              <div className={styles.photoGrid}>
                {Object.entries(photos).map(([photoId, photoURL]) => (
                  <div key={photoId} className={styles.photoPreviewItem}>
                    {photoURL ? (
                      <>
                        <img
                          src={photoURL}
                          alt={`Profile preview ${photoId}`}
                          className={styles.previewImage}
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(photoId)}
                          className={styles.removePhotoButton}
                          disabled={isSubmitting}
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <div className={styles.photoEmptySlot}>
                        {isSubmitting
                          ? "Uploading..."
                          : `Photo ${photoId.replace("photo", "")}`}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Camera preview */}
              <div className={styles.cameraPreview}>
                <video
                  ref={videoRef}
                  className={styles.previewVideo}
                  style={{ display: cameraActive ? "block" : "none" }}
                />
                {!cameraActive && photoCount < 5 && (
                  <div className={styles.placeholder}>
                    Camera preview will appear here
                  </div>
                )}
                {!cameraActive && cameraPermission === "prompt" && (
                  <button
                    type="button"
                    onClick={startCamera}
                    className={styles.permissionButton}
                  >
                    Allow Camera Access
                  </button>
                )}
              </div>

              <canvas ref={canvasRef} style={{ display: "none" }} />
              <div className={styles.buttonColumn}>
                {photoCount < 5 && (
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
                          multiple
                          style={{ display: "none" }}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current.click()}
                          className={styles.mediaButton}
                          disabled={isSubmitting}
                        >
                          Upload Photos
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={takePhoto}
                        className={styles.mediaButton}
                        disabled={isSubmitting}
                      >
                        Take Photo ({photoCount + 1}/5)
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Voice Recording Sections */}
            <div className={styles.voiceContainer}>
              <h3 className={styles.sectionTitle}>Voice Verification</h3>

              {/* Recording 1 */}
              <div className={styles.recordingGroup}>
                <label className={styles.recordingPrompt}>
                  Now say: "Ana Esmy {name}"
                </label>
                <div className={styles.mediaPreview}>
                  {audioURLs.recording1 ? (
                    <audio
                      controls
                      src={audioURLs.recording1}
                      className={styles.audioPlayer}
                    />
                  ) : (
                    <div className={styles.placeholder}>
                      {isRecording.recording1 ? "Recording..." : "No recording"}
                    </div>
                  )}
                  {Object.values(isRecording).every((val) => !val) &&
                    microphonePermission === "prompt" && (
                      <button
                        type="button"
                        onClick={() => startRecording("recording1")}
                        className={styles.permissionButton}
                      >
                        Allow Microphone Access
                      </button>
                    )}
                </div>
                <div className={styles.buttonColumn}>
                  {!isRecording.recording1 ? (
                    <button
                      type="button"
                      onClick={() => startRecording("recording1")}
                      className={styles.mediaButton}
                      disabled={isSubmitting}
                    >
                      Start Recording 1
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => stopRecording("recording1")}
                      className={styles.mediaButton}
                    >
                      Stop Recording
                    </button>
                  )}
                  {audioURLs.recording1 && (
                    <button
                      type="button"
                      onClick={() => clearRecording("recording1")}
                      className={styles.mediaButton}
                      disabled={isSubmitting}
                    >
                      Re-record
                    </button>
                  )}
                </div>
              </div>

              {/* Recording 2 */}
              <div className={styles.recordingGroup}>
                <label className={styles.recordingPrompt}>
                  Now say your name slowly(take 3 seconds or more): "{name}"
                </label>
                <div className={styles.mediaPreview}>
                  {audioURLs.recording2 ? (
                    <audio
                      controls
                      src={audioURLs.recording2}
                      className={styles.audioPlayer}
                    />
                  ) : (
                    <div className={styles.placeholder}>
                      {isRecording.recording2 ? "Recording..." : "No recording"}
                    </div>
                  )}
                </div>
                <div className={styles.buttonColumn}>
                  {!isRecording.recording2 ? (
                    <button
                      type="button"
                      onClick={() => startRecording("recording2")}
                      className={styles.mediaButton}
                      disabled={isSubmitting}
                    >
                      Start Recording 2
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => stopRecording("recording2")}
                      className={styles.mediaButton}
                    >
                      Stop Recording
                    </button>
                  )}
                  {audioURLs.recording2 && (
                    <button
                      type="button"
                      onClick={() => clearRecording("recording2")}
                      className={styles.mediaButton}
                      disabled={isSubmitting}
                    >
                      Re-record
                    </button>
                  )}
                </div>
              </div>

              {/* Recording 3 */}
              <div className={styles.recordingGroup}>
                <label className={styles.recordingPrompt}>
                  Now say your name normally: "{name}"
                </label>
                <div className={styles.mediaPreview}>
                  {audioURLs.recording3 ? (
                    <audio
                      controls
                      src={audioURLs.recording3}
                      className={styles.audioPlayer}
                    />
                  ) : (
                    <div className={styles.placeholder}>
                      {isRecording.recording3 ? "Recording..." : "No recording"}
                    </div>
                  )}
                </div>
                <div className={styles.buttonColumn}>
                  {!isRecording.recording3 ? (
                    <button
                      type="button"
                      onClick={() => startRecording("recording3")}
                      className={styles.mediaButton}
                      disabled={isSubmitting}
                    >
                      Start Recording 3
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => stopRecording("recording3")}
                      className={styles.mediaButton}
                    >
                      Stop Recording
                    </button>
                  )}
                  {audioURLs.recording3 && (
                    <button
                      type="button"
                      onClick={() => clearRecording("recording3")}
                      className={styles.mediaButton}
                      disabled={isSubmitting}
                    >
                      Re-record
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <h2>
            Please confirm that all the data you entered is correct and proceed.
          </h2>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting || photoCount < 5}
          >
            {isSubmitting ? (
              <>
                <span className={styles.spinner}></span>
                Processing...
              </>
            ) : (
              "Complete Registration"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
