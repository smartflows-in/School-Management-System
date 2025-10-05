import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Admissions.css';

const Admissions = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [currentDocument, setCurrentDocument] = useState('');
  const [stream, setStream] = useState(null);
  const [capturedImages, setCapturedImages] = useState({});
  
  const [formData, setFormData] = useState({
    // Student Information
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    
    // Parent/Guardian Information
    fatherName: '',
    fatherOccupation: '',
    fatherPhone: '',
    fatherEmail: '',
    motherName: '',
    motherOccupation: '',
    motherPhone: '',
    motherEmail: '',
    
    // Contact Information
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    email: '',
    
    // Academic Information
    applyingForGrade: '',
    previousSchool: '',
    previousGrade: '',
    reasonForLeaving: '',
    
    // Additional Information
    medicalConditions: '',
    emergencyContact: '',
    emergencyPhone: '',
    
    // Documents (will be populated from captured images)
    aadharCard: '',
    birthCertificate: '',
    previousMarksheet: '',
    transferCertificate: '',
    passportPhoto: ''
  });

  // Document types with their labels and descriptions
  const documentTypes = {
    aadharCard: {
      label: 'Aadhar Card',
      description: 'Capture front side of Aadhar card',
      required: true
    },
    birthCertificate: {
      label: 'Birth Certificate',
      description: 'Capture the birth certificate document',
      required: true
    },
    previousMarksheet: {
      label: 'Previous Year Marksheet',
      description: 'Capture the latest marksheet',
      required: true
    },
    transferCertificate: {
      label: 'Transfer Certificate',
      description: 'Capture transfer certificate from previous school',
      required: true
    },
    passportPhoto: {
      label: 'Passport Size Photo',
      description: 'Take a passport size photo',
      required: true
    }
  };

  // Open camera for specific document
  const openCamera = async (documentType) => {
    setCurrentDocument(documentType);
    
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      setStream(mediaStream);
      setIsCameraOpen(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  // Capture photo from camera
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get image as data URL
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      
      // Save captured image
      setCapturedImages(prev => ({
        ...prev,
        [currentDocument]: imageDataUrl
      }));
      
      // Update form data
      setFormData(prev => ({
        ...prev,
        [currentDocument]: imageDataUrl
      }));
      
      // Close camera
      closeCamera();
    }
  };

  // Close camera and stop stream
  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
    setCurrentDocument('');
  };

  // Retake photo for a document
  const retakePhoto = (documentType) => {
    setCapturedImages(prev => ({
      ...prev,
      [documentType]: null
    }));
    
    setFormData(prev => ({
      ...prev,
      [documentType]: ''
    }));
    
    openCamera(documentType);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if all required documents are captured
    const missingDocuments = Object.entries(documentTypes)
      .filter(([key, doc]) => doc.required && !capturedImages[key])
      .map(([key, doc]) => doc.label);
    
    if (missingDocuments.length > 0) {
      alert(`Please capture the following required documents: ${missingDocuments.join(', ')}`);
      return;
    }
    
    // Handle form submission logic here
    console.log('Admission form submitted:', formData);
    console.log('Captured documents:', capturedImages);
    
    alert('Admission application submitted successfully! We will contact you soon.');
    navigate('/');
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleBack = () => {
    navigate('/');
  };

  const grades = [
    'Nursery', 'LKG', 'UKG', 
    'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
    'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10',
    'Grade 11 (Science)', 'Grade 11 (Commerce)', 'Grade 11 (Arts)',
    'Grade 12 (Science)', 'Grade 12 (Commerce)', 'Grade 12 (Arts)'
  ];

  // Camera Modal Component
  const CameraModal = () => (
    <div className="camera-modal">
      <div className="camera-container">
        <div className="camera-header">
          <h3>Capture {documentTypes[currentDocument]?.label}</h3>
          <p>{documentTypes[currentDocument]?.description}</p>
          <button className="close-camera" onClick={closeCamera}>×</button>
        </div>
        
        <div className="camera-preview">
          <video 
            ref={videoRef}
            autoPlay 
            playsInline
            className="camera-video"
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
        
        <div className="camera-controls">
          <button className="btn btn-secondary" onClick={closeCamera}>
            Cancel
          </button>
          <button className="btn btn-primary capture-btn" onClick={capturePhoto}>
            📸 Capture
          </button>
        </div>
        
        <div className="camera-instructions">
          <p>💡 Make sure the document is well-lit and clearly visible</p>
          <p>📄 Place the document on a flat surface</p>
          <p>⚡ Hold steady while capturing</p>
        </div>
      </div>
    </div>
  );

  // Document Capture Card Component
  const DocumentCaptureCard = ({ docType, docInfo }) => (
    <div className="document-card">
      <div className="document-info">
        <h4>{docInfo.label}</h4>
        <p>{docInfo.description}</p>
        {docInfo.required && <span className="required-badge">Required</span>}
      </div>
      
      <div className="document-preview">
        {capturedImages[docType] ? (
          <div className="captured-image">
            <img src={capturedImages[docType]} alt={`Captured ${docInfo.label}`} />
            <div className="image-actions">
              <button 
                className="btn-retake"
                onClick={() => retakePhoto(docType)}
              >
                Retake
              </button>
              <span className="captured-badge">✓ Captured</span>
            </div>
          </div>
        ) : (
          <button 
            className="btn-capture"
            onClick={() => openCamera(docType)}
          >
            <span className="camera-icon">📷</span>
            Capture Document
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="admissions-page">
      {/* Camera Modal */}
      {isCameraOpen && <CameraModal />}

      {/* Header */}
      <header className="admissions-header">
        <div className="container">
          <button className="back-btn" onClick={handleBack}>
            ← Back to Home
          </button>
          <div className="admissions-brand">
            <div className="brand-logo">BF</div>
            <div>
              <h1>Admissions 2024-25</h1>
              <p>Bright Future Academy - Begin Your Journey to Excellence</p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="container">
          <div className="progress-bar">
            <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">Student Info</span>
            </div>
            <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">Parent Info</span>
            </div>
            <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
              <span className="step-number">3</span>
              <span className="step-label">Academic Info</span>
            </div>
            <div className={`progress-step ${currentStep >= 4 ? 'active' : ''}`}>
              <span className="step-number">4</span>
              <span className="step-label">Documents</span>
            </div>
            <div className={`progress-step ${currentStep >= 5 ? 'active' : ''}`}>
              <span className="step-number">5</span>
              <span className="step-label">Review & Submit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <main className="admissions-main">
        <div className="container">
          <div className="admissions-card">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Student Information */}
              {currentStep === 1 && (
                <div className="form-step">
                  <h2>Student Information</h2>
                  <p>Please provide the basic details of the student</p>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name *</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="lastName">Last Name *</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="dateOfBirth">Date of Birth *</label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="gender">Gender *</label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="nationality">Nationality *</label>
                      <input
                        type="text"
                        id="nationality"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-actions">
                    <button type="button" className="btn btn-primary" onClick={nextStep}>
                      Next: Parent Information →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Parent/Guardian Information */}
              {currentStep === 2 && (
                <div className="form-step">
                  <h2>Parent/Guardian Information</h2>
                  <p>Details of the student's parents or guardians</p>
                  
                  <div className="form-section">
                    <h4>Father's Information</h4>
                    <div className="form-grid">
                      <div className="form-group">
                        <label htmlFor="fatherName">Father's Full Name *</label>
                        <input
                          type="text"
                          id="fatherName"
                          name="fatherName"
                          value={formData.fatherName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="fatherOccupation">Occupation *</label>
                        <input
                          type="text"
                          id="fatherOccupation"
                          name="fatherOccupation"
                          value={formData.fatherOccupation}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="fatherPhone">Phone Number *</label>
                        <input
                          type="tel"
                          id="fatherPhone"
                          name="fatherPhone"
                          value={formData.fatherPhone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="fatherEmail">Email Address</label>
                        <input
                          type="email"
                          id="fatherEmail"
                          name="fatherEmail"
                          value={formData.fatherEmail}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-section">
                    <h4>Mother's Information</h4>
                    <div className="form-grid">
                      <div className="form-group">
                        <label htmlFor="motherName">Mother's Full Name *</label>
                        <input
                          type="text"
                          id="motherName"
                          name="motherName"
                          value={formData.motherName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="motherOccupation">Occupation *</label>
                        <input
                          type="text"
                          id="motherOccupation"
                          name="motherOccupation"
                          value={formData.motherOccupation}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="motherPhone">Phone Number *</label>
                        <input
                          type="tel"
                          id="motherPhone"
                          name="motherPhone"
                          value={formData.motherPhone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="motherEmail">Email Address</label>
                        <input
                          type="email"
                          id="motherEmail"
                          name="motherEmail"
                          value={formData.motherEmail}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={prevStep}>
                      ← Previous
                    </button>
                    <button type="button" className="btn btn-primary" onClick={nextStep}>
                      Next: Academic Information →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Academic Information */}
              {currentStep === 3 && (
                <div className="form-step">
                  <h2>Academic Information</h2>
                  <p>Details about the student's educational background</p>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="applyingForGrade">Applying for Grade/Class *</label>
                      <select
                        id="applyingForGrade"
                        name="applyingForGrade"
                        value={formData.applyingForGrade}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Grade</option>
                        {grades.map(grade => (
                          <option key={grade} value={grade}>{grade}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="previousSchool">Previous School *</label>
                      <input
                        type="text"
                        id="previousSchool"
                        name="previousSchool"
                        value={formData.previousSchool}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="previousGrade">Previous Grade/Class *</label>
                      <input
                        type="text"
                        id="previousGrade"
                        name="previousGrade"
                        value={formData.previousGrade}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group full-width">
                      <label htmlFor="reasonForLeaving">Reason for Leaving Previous School</label>
                      <textarea
                        id="reasonForLeaving"
                        name="reasonForLeaving"
                        value={formData.reasonForLeaving}
                        onChange={handleChange}
                        rows="3"
                      />
                    </div>
                  </div>
                  
                  <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={prevStep}>
                      ← Previous
                    </button>
                    <button type="button" className="btn btn-primary" onClick={nextStep}>
                      Next: Document Upload →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Document Capture */}
              {currentStep === 4 && (
                <div className="form-step">
                  <h2>Document Capture</h2>
                  <p>Please capture clear photos of the required documents using your camera</p>
                  
                  <div className="documents-grid">
                    {Object.entries(documentTypes).map(([docType, docInfo]) => (
                      <DocumentCaptureCard 
                        key={docType}
                        docType={docType}
                        docInfo={docInfo}
                      />
                    ))}
                  </div>
                  
                  <div className="capture-instructions">
                    <h4>📋 Document Capture Guidelines:</h4>
                    <ul>
                      <li>Ensure good lighting when capturing documents</li>
                      <li>Place documents on a flat, dark surface</li>
                      <li>Make sure all text is clearly visible and not blurry</li>
                      <li>Capture the entire document within the frame</li>
                      <li>Avoid shadows and glare on the document</li>
                    </ul>
                  </div>
                  
                  <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={prevStep}>
                      ← Previous
                    </button>
                    <button type="button" className="btn btn-primary" onClick={nextStep}>
                      Next: Review & Submit →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5: Review and Submit */}
              {currentStep === 5 && (
                <div className="form-step">
                  <h2>Review & Submit Application</h2>
                  <p>Please review all information and captured documents before submitting</p>
                  
                  <div className="review-section">
                    <h4>Student Information</h4>
                    <div className="review-grid">
                      <div><strong>Name:</strong> {formData.firstName} {formData.lastName}</div>
                      <div><strong>Date of Birth:</strong> {formData.dateOfBirth}</div>
                      <div><strong>Gender:</strong> {formData.gender}</div>
                      <div><strong>Nationality:</strong> {formData.nationality}</div>
                    </div>
                  </div>
                  
                  <div className="review-section">
                    <h4>Parent Information</h4>
                    <div className="review-grid">
                      <div><strong>Father's Name:</strong> {formData.fatherName}</div>
                      <div><strong>Father's Occupation:</strong> {formData.fatherOccupation}</div>
                      <div><strong>Mother's Name:</strong> {formData.motherName}</div>
                      <div><strong>Mother's Occupation:</strong> {formData.motherOccupation}</div>
                    </div>
                  </div>
                  
                  <div className="review-section">
                    <h4>Academic Information</h4>
                    <div className="review-grid">
                      <div><strong>Applying for:</strong> {formData.applyingForGrade}</div>
                      <div><strong>Previous School:</strong> {formData.previousSchool}</div>
                      <div><strong>Previous Grade:</strong> {formData.previousGrade}</div>
                    </div>
                  </div>
                  
                  <div className="review-section">
                    <h4>Captured Documents</h4>
                    <div className="documents-review">
                      {Object.entries(documentTypes).map(([docType, docInfo]) => (
                        <div key={docType} className="document-review-item">
                          <span className="document-name">{docInfo.label}:</span>
                          <span className={`document-status ${capturedImages[docType] ? 'captured' : 'missing'}`}>
                            {capturedImages[docType] ? '✓ Captured' : '❌ Missing'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={prevStep}>
                      ← Previous
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Submit Application
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="admissions-footer">
        <div className="container">
          <div className="footer-content">
            <p>Need help with document capture? Contact admissions office:</p>
            <div className="contact-info">
              <span>📞 +91 98765 43210</span>
              <span>✉️ admissions@bfacademy.edu</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Admissions;