import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import '../styles/Admissions.css';

const Admissions = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
    aadhaar_number: '',
    father_name: '',
    father_dob: '',
    father_gender: '',
    father_aadhaar_number: '',
    mother_name: '',
    mother_dob: '',
    mother_gender: '',
    mother_aadhaar_number: '',
    address: '',
    blood_group: '',
    phone: '',
    class_grade: ''
  });
  const [studentAadhaarImage, setStudentAadhaarImage] = useState(null);
  const [fatherAadhaarImage, setFatherAadhaarImage] = useState(null);
  const [motherAadhaarImage, setMotherAadhaarImage] = useState(null);
  const [studentPhoto, setStudentPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [studentExtractionSuccess, setStudentExtractionSuccess] = useState(false);
  const [fatherExtractionSuccess, setFatherExtractionSuccess] = useState(false);
  const [motherExtractionSuccess, setMotherExtractionSuccess] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showIdCard, setShowIdCard] = useState(false);
  const idCardRef = useRef(null);

  const API_URL = 'https://school-management-system-toqs.onrender.com/api/admissions/extract-aadhaar';
  const SUBMIT_URL = 'https://school-management-system-toqs.onrender.com/api/admissions/submit';

  const formatDob = (dobString) => {
    if (!dobString) return '';
    const parts = dobString.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      const formatted = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      const date = new Date(formatted);
      if (!isNaN(date.getTime()) && date.getFullYear() == year) {
        return formatted;
      }
    }
    console.warn('Invalid DOB format from API:', dobString);
    return '';
  };

  const handleStudentImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => setStudentAadhaarImage(e.target.result);
    reader.readAsDataURL(file);

    setLoading(true);
    setError('');
    setSuccessMessage('');
    setStudentExtractionSuccess(false);
    setProgress(10);

    const formDataToSend = new FormData();
    formDataToSend.append('file', file);

    try {
      const uploadInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 20, 50));
      }, 300);

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formDataToSend,
      });

      clearInterval(uploadInterval);
      setProgress(60);

      const processInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const result = await response.json();
      clearInterval(processInterval);

      if (result.success) {
        const extractedData = {
          name: result.data.name || '',
          dob: formatDob(result.data.dob),
          gender: result.data.gender || '',
          aadhaar_number: result.data.aadhaar_number || ''
        };
        setFormData(prev => ({ ...prev, ...extractedData }));
        setProgress(100);
        setStudentExtractionSuccess(true);
        setSuccessMessage('Aadhaar details extracted successfully!');
      } else {
        throw new Error(result.message || 'Extraction failed');
      }
    } catch (err) {
      setProgress(0);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFatherImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => setFatherAadhaarImage(e.target.result);
    reader.readAsDataURL(file);

    setLoading(true);
    setError('');
    setSuccessMessage('');
    setFatherExtractionSuccess(false);
    setProgress(10);

    const formDataToSend = new FormData();
    formDataToSend.append('file', file);

    try {
      const uploadInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 20, 50));
      }, 300);

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formDataToSend,
      });

      clearInterval(uploadInterval);
      setProgress(60);

      const processInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const result = await response.json();
      clearInterval(processInterval);

      if (result.success) {
        const extractedData = {
          father_name: result.data.name || '',
          father_dob: formatDob(result.data.dob),
          father_gender: result.data.gender || '',
          father_aadhaar_number: result.data.aadhaar_number || ''
          // Skip father's name from API for parent
        };
        setFormData(prev => ({ ...prev, ...extractedData }));
        setProgress(100);
        setFatherExtractionSuccess(true);
        setSuccessMessage("Father's Aadhaar details extracted successfully!");
      } else {
        throw new Error(result.message || 'Extraction failed');
      }
    } catch (err) {
      setProgress(0);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMotherImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => setMotherAadhaarImage(e.target.result);
    reader.readAsDataURL(file);

    setLoading(true);
    setError('');
    setSuccessMessage('');
    setMotherExtractionSuccess(false);
    setProgress(10);

    const formDataToSend = new FormData();
    formDataToSend.append('file', file);

    try {
      const uploadInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 20, 50));
      }, 300);

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formDataToSend,
      });

      clearInterval(uploadInterval);
      setProgress(60);

      const processInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const result = await response.json();
      clearInterval(processInterval);

      if (result.success) {
        const extractedData = {
          mother_name: result.data.name || '',
          mother_dob: formatDob(result.data.dob),
          mother_gender: result.data.gender || '',
          mother_aadhaar_number: result.data.aadhaar_number || ''
          // Skip father's name from API for parent
        };
        setFormData(prev => ({ ...prev, ...extractedData }));
        setProgress(100);
        setMotherExtractionSuccess(true);
        setSuccessMessage("Mother's Aadhaar details extracted successfully!");
      } else {
        throw new Error(result.message || 'Extraction failed');
      }
    } catch (err) {
      setProgress(0);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentFileSelect = (event) => {
    handleStudentImageUpload(event);
  };

  const handleStudentCameraCapture = (event) => {
    handleStudentImageUpload(event);
  };

  const handleFatherFileSelect = (event) => {
    handleFatherImageUpload(event);
  };

  const handleFatherCameraCapture = (event) => {
    handleFatherImageUpload(event);
  };

  const handleMotherFileSelect = (event) => {
    handleMotherImageUpload(event);
  };

  const handleMotherCameraCapture = (event) => {
    handleMotherImageUpload(event);
  };

  const handleNextStep1 = () => {
    if (studentExtractionSuccess) {
      setCurrentStep(2);
      setError('');
    } else {
      setError('Please upload Aadhaar and ensure all details are extracted.');
    }
  };

  const handleNextStep2 = () => {
    if (!formData.address || !formData.blood_group || !formData.phone || !formData.class_grade) {
      setError('All fields with * are required.');
      return;
    }
    setCurrentStep(3);
    setError('');
  };

  const handleNextStep3 = () => {
    if (fatherExtractionSuccess) {
      setCurrentStep(4);
      setError('');
    } else {
      setError("Please upload Father's Aadhaar and ensure details are extracted.");
    }
  };

  const handleMotherSubmit = async () => {
    if (!motherExtractionSuccess) {
      setError("Please upload Mother's Aadhaar and ensure details are extracted.");
      return;
    }
    if (!formData.address || !formData.blood_group || !formData.phone || !formData.class_grade || !formData.father_name || !formData.mother_name) {
      setError('All required fields must be filled.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch(SUBMIT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Submit Error: ${response.status}`);
      }

      setShowIdCard(true);
      setSuccessMessage('Application submitted! ID Card generated below.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentPhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setStudentPhoto(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBloodGroupChange = (e) => {
    setFormData(prev => ({ ...prev, blood_group: e.target.value }));
  };

  const downloadIdCard = async () => {
    if (!idCardRef.current) return;

    setLoading(true);
    try {
      const element = idCardRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight + 40,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight + 40
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Margins
      const margin = 10;
      const pdfWidth = pageWidth - 2 * margin;
      const pdfHeight = pageHeight - 2 * margin;
      
      // Calculate scale to fit
      const imgRatio = canvas.width / canvas.height;
      const pdfRatio = pdfWidth / pdfHeight;
      let imgWidth, imgHeight, x, y;
      
      if (imgRatio > pdfRatio) {
        // Image taller, scale by width
        imgWidth = pdfWidth;
        imgHeight = pdfWidth / imgRatio;
        x = margin;
        y = (pageHeight - imgHeight) / 2;
      } else {
        // Image wider, scale by height
        imgHeight = pdfHeight;
        imgWidth = pdfHeight * imgRatio;
        x = (pageWidth - imgWidth) / 2;
        y = margin;
      }
      
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      pdf.save('Student-ID-Card.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to download ID card. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admission-portal-container">
      <div className="admission-portal-wrapper">
        <div className="admission-portal-header">
          <h1 className="admission-portal-title">Student Admissions Portal</h1>
          <p className="admission-portal-subtitle">Complete the steps to apply and generate your ID card</p>
        </div>

        {/* Step Indicators */}
        <div className="admission-steps-container">
          <div className="admission-steps-indicator">
            <div className={`admission-step ${currentStep >= 1 ? 'admission-step-active' : ''}`}>
              <div className="admission-step-number">1</div>
              <div className="admission-step-label">Student Aadhaar</div>
            </div>
            <div className={`admission-step ${currentStep >= 2 ? 'admission-step-active' : ''}`}>
              <div className="admission-step-number">2</div>
              <div className="admission-step-label">Student Details</div>
            </div>
            <div className={`admission-step ${currentStep >= 3 ? 'admission-step-active' : ''}`}>
              <div className="admission-step-number">3</div>
              <div className="admission-step-label">Father Aadhaar</div>
            </div>
            <div className={`admission-step ${currentStep >= 4 ? 'admission-step-active' : ''}`}>
              <div className="admission-step-number">4</div>
              <div className="admission-step-label">Mother Aadhaar</div>
            </div>
            <div className={`admission-step ${showIdCard ? 'admission-step-active' : ''}`}>
              <div className="admission-step-number">5</div>
              <div className="admission-step-label">ID Card</div>
            </div>
          </div>
        </div>

        {/* Step 1: Student Aadhaar Upload */}
        {currentStep === 1 && (
          <div className="admission-step-content">
            <div className="aadhaar-upload-card">
              <div className="aadhaar-upload-header">
                <div className="aadhaar-upload-icon">📷</div>
                <h3>Upload Student Aadhaar Card</h3>
                <p>Choose your preferred method to upload Aadhaar card image</p>
              </div>
              
              <div className="aadhaar-upload-options">
                <div className="upload-option-group">
                  <label htmlFor="student-aadhaar-file-upload" className="upload-option-label">
                    <div className="upload-option-card">
                      <div className="upload-option-icon">📁</div>
                      <div className="upload-option-content">
                        <h4>Upload File</h4>
                        <p>Choose from your device</p>
                        <span className="upload-option-hint">JPG, PNG, JPEG formats</span>
                      </div>
                    </div>
                  </label>
                  <input
                    id="student-aadhaar-file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleStudentFileSelect}
                    className="aadhaar-file-input"
                  />
                </div>

                <div className="upload-option-group">
                  <label htmlFor="student-aadhaar-camera-capture" className="upload-option-label">
                    <div className="upload-option-card">
                      <div className="upload-option-icon">📸</div>
                      <div className="upload-option-content">
                        <h4>Take Photo</h4>
                        <p>Use your camera</p>
                        <span className="upload-option-hint">Capture instantly</span>
                      </div>
                    </div>
                  </label>
                  <input
                    id="student-aadhaar-camera-capture"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleStudentCameraCapture}
                    className="aadhaar-file-input"
                  />
                </div>
              </div>

              {studentAadhaarImage && (
                <div className="aadhaar-image-preview">
                  <div className="preview-section-header">
                    <span>Aadhaar Preview</span>
                  </div>
                  <img src={studentAadhaarImage} alt="Aadhaar Preview" className="aadhaar-preview-image" />
                </div>
              )}

              {loading && (
                <div className="aadhaar-progress-section">
                  <div className="aadhaar-progress-header">
                    <span>Extracting details...</span>
                    <span className="aadhaar-progress-percent">{Math.round(progress)}%</span>
                  </div>
                  <div className="aadhaar-progress-bar">
                    <div className="aadhaar-progress-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              )}

              {studentExtractionSuccess && (
                <div className="aadhaar-preview-card">
                  <div className="aadhaar-preview-header">
                    <h4>✅ Extracted Details</h4>
                  </div>
                  <div className="aadhaar-preview-grid">
                    <div className="aadhaar-preview-item">
                      <label>Name</label>
                      <span>{formData.name}</span>
                    </div>
                    <div className="aadhaar-preview-item">
                      <label>DOB</label>
                      <span>{formData.dob}</span>
                    </div>
                    <div className="aadhaar-preview-item">
                      <label>Gender</label>
                      <span>{formData.gender}</span>
                    </div>
                    <div className="aadhaar-preview-item">
                      <label>Aadhaar Number</label>
                      <span>{formData.aadhaar_number}</span>
                    </div>
                  </div>
                </div>
              )}

              {error && <div className="admission-message admission-error-message">{error}</div>}
              {successMessage && <div className="admission-message admission-success-message">{successMessage}</div>}

              <button onClick={handleNextStep1} className="admission-btn admission-primary-btn admission-next-btn" disabled={loading || !studentExtractionSuccess}>
                Continue to Details
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Student Additional Details */}
        {currentStep === 2 && (
          <form className="admission-step-content">
            <div className="admission-form-card">
              <div className="admission-form-header">
                <h3>Student Information</h3>
                <p>Please fill in the remaining details</p>
              </div>

              <div className="admission-form-grid">
                <div className="admission-form-group admission-form-fullwidth">
                  <label htmlFor="address" className="admission-form-label">
                    Address <span className="admission-required">*</span>
                  </label>
                  <textarea 
                    id="address" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleInputChange} 
                    required 
                    rows={3} 
                    className="admission-form-input" 
                    placeholder="Enter your complete address"
                  />
                </div>

                <div className="admission-form-group">
                  <label htmlFor="blood_group" className="admission-form-label">
                    Blood Group <span className="admission-required">*</span>
                  </label>
                  <select 
                    id="blood_group" 
                    name="blood_group" 
                    value={formData.blood_group} 
                    onChange={handleBloodGroupChange} 
                    className="admission-form-input" 
                    required
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div className="admission-form-group">
                  <label htmlFor="phone" className="admission-form-label">
                    Phone Number <span className="admission-required">*</span>
                  </label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    required 
                    className="admission-form-input" 
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="admission-form-group">
                  <label htmlFor="class_grade" className="admission-form-label">
                    Class/Grade <span className="admission-required">*</span>
                  </label>
                  <input 
                    type="text" 
                    id="class_grade" 
                    name="class_grade" 
                    value={formData.class_grade} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="e.g., 10th Standard" 
                    className="admission-form-input" 
                  />
                </div>
              </div>

              <div className="student-photo-upload-section">
                <label className="admission-form-label">Student Photo for ID Card</label>
                <div className="student-photo-upload-area">
                  <input
                    id="student-photo"
                    type="file"
                    accept="image/*"
                    onChange={handleStudentPhotoUpload}
                    className="student-photo-input"
                  />
                  <label htmlFor="student-photo" className="student-photo-label">
                    <div className="student-photo-placeholder">
                      {studentPhoto ? (
                        <img src={studentPhoto} alt="Student" className="student-photo-preview" />
                      ) : (
                        <>
                          <div className="student-photo-icon">📸</div>
                          <span>Upload Student Photo</span>
                        </>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {error && <div className="admission-message admission-error-message">{error}</div>}

              <button type="button" onClick={handleNextStep2} className="admission-btn admission-primary-btn admission-next-btn" disabled={loading}>
                Continue to Father's Aadhaar
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Father Aadhaar Upload */}
        {currentStep === 3 && (
          <div className="admission-step-content">
            <div className="aadhaar-upload-card">
              <div className="aadhaar-upload-header">
                <div className="aadhaar-upload-icon">📷</div>
                <h3>Upload Father's Aadhaar Card</h3>
                <p>Choose your preferred method to upload Father's Aadhaar card image</p>
              </div>
              
              <div className="aadhaar-upload-options">
                <div className="upload-option-group">
                  <label htmlFor="father-aadhaar-file-upload" className="upload-option-label">
                    <div className="upload-option-card">
                      <div className="upload-option-icon">📁</div>
                      <div className="upload-option-content">
                        <h4>Upload File</h4>
                        <p>Choose from your device</p>
                        <span className="upload-option-hint">JPG, PNG, JPEG formats</span>
                      </div>
                    </div>
                  </label>
                  <input
                    id="father-aadhaar-file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFatherFileSelect}
                    className="aadhaar-file-input"
                  />
                </div>

                <div className="upload-option-group">
                  <label htmlFor="father-aadhaar-camera-capture" className="upload-option-label">
                    <div className="upload-option-card">
                      <div className="upload-option-icon">📸</div>
                      <div className="upload-option-content">
                        <h4>Take Photo</h4>
                        <p>Use your camera</p>
                        <span className="upload-option-hint">Capture instantly</span>
                      </div>
                    </div>
                  </label>
                  <input
                    id="father-aadhaar-camera-capture"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFatherCameraCapture}
                    className="aadhaar-file-input"
                  />
                </div>
              </div>

              {fatherAadhaarImage && (
                <div className="aadhaar-image-preview">
                  <div className="preview-section-header">
                    <span>Aadhaar Preview</span>
                  </div>
                  <img src={fatherAadhaarImage} alt="Father Aadhaar Preview" className="aadhaar-preview-image" />
                </div>
              )}

              {loading && (
                <div className="aadhaar-progress-section">
                  <div className="aadhaar-progress-header">
                    <span>Extracting details...</span>
                    <span className="aadhaar-progress-percent">{Math.round(progress)}%</span>
                  </div>
                  <div className="aadhaar-progress-bar">
                    <div className="aadhaar-progress-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              )}

              {fatherExtractionSuccess && (
                <div className="aadhaar-preview-card">
                  <div className="aadhaar-preview-header">
                    <h4>✅ Extracted Details</h4>
                  </div>
                  <div className="aadhaar-preview-grid">
                    <div className="aadhaar-preview-item">
                      <label>Name</label>
                      <span>{formData.father_name}</span>
                    </div>
                    <div className="aadhaar-preview-item">
                      <label>DOB</label>
                      <span>{formData.father_dob}</span>
                    </div>
                    <div className="aadhaar-preview-item">
                      <label>Gender</label>
                      <span>{formData.father_gender}</span>
                    </div>
                    <div className="aadhaar-preview-item">
                      <label>Aadhaar Number</label>
                      <span>{formData.father_aadhaar_number}</span>
                    </div>
                  </div>
                </div>
              )}

              {error && <div className="admission-message admission-error-message">{error}</div>}
              {successMessage && <div className="admission-message admission-success-message">{successMessage}</div>}

              <button onClick={handleNextStep3} className="admission-btn admission-primary-btn admission-next-btn" disabled={loading || !fatherExtractionSuccess}>
                Continue to Mother's Aadhaar
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Mother Aadhaar Upload */}
        {currentStep === 4 && (
          <div className="admission-step-content">
            <div className="aadhaar-upload-card">
              <div className="aadhaar-upload-header">
                <div className="aadhaar-upload-icon">📷</div>
                <h3>Upload Mother's Aadhaar Card</h3>
                <p>Choose your preferred method to upload Mother's Aadhaar card image</p>
              </div>
              
              <div className="aadhaar-upload-options">
                <div className="upload-option-group">
                  <label htmlFor="mother-aadhaar-file-upload" className="upload-option-label">
                    <div className="upload-option-card">
                      <div className="upload-option-icon">📁</div>
                      <div className="upload-option-content">
                        <h4>Upload File</h4>
                        <p>Choose from your device</p>
                        <span className="upload-option-hint">JPG, PNG, JPEG formats</span>
                      </div>
                    </div>
                  </label>
                  <input
                    id="mother-aadhaar-file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleMotherFileSelect}
                    className="aadhaar-file-input"
                  />
                </div>

                <div className="upload-option-group">
                  <label htmlFor="mother-aadhaar-camera-capture" className="upload-option-label">
                    <div className="upload-option-card">
                      <div className="upload-option-icon">📸</div>
                      <div className="upload-option-content">
                        <h4>Take Photo</h4>
                        <p>Use your camera</p>
                        <span className="upload-option-hint">Capture instantly</span>
                      </div>
                    </div>
                  </label>
                  <input
                    id="mother-aadhaar-camera-capture"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleMotherCameraCapture}
                    className="aadhaar-file-input"
                  />
                </div>
              </div>

              {motherAadhaarImage && (
                <div className="aadhaar-image-preview">
                  <div className="preview-section-header">
                    <span>Aadhaar Preview</span>
                  </div>
                  <img src={motherAadhaarImage} alt="Mother Aadhaar Preview" className="aadhaar-preview-image" />
                </div>
              )}

              {loading && (
                <div className="aadhaar-progress-section">
                  <div className="aadhaar-progress-header">
                    <span>Extracting details...</span>
                    <span className="aadhaar-progress-percent">{Math.round(progress)}%</span>
                  </div>
                  <div className="aadhaar-progress-bar">
                    <div className="aadhaar-progress-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              )}

              {motherExtractionSuccess && (
                <div className="aadhaar-preview-card">
                  <div className="aadhaar-preview-header">
                    <h4>✅ Extracted Details</h4>
                  </div>
                  <div className="aadhaar-preview-grid">
                    <div className="aadhaar-preview-item">
                      <label>Name</label>
                      <span>{formData.mother_name}</span>
                    </div>
                    <div className="aadhaar-preview-item">
                      <label>DOB</label>
                      <span>{formData.mother_dob}</span>
                    </div>
                    <div className="aadhaar-preview-item">
                      <label>Gender</label>
                      <span>{formData.mother_gender}</span>
                    </div>
                    <div className="aadhaar-preview-item">
                      <label>Aadhaar Number</label>
                      <span>{formData.mother_aadhaar_number}</span>
                    </div>
                  </div>
                </div>
              )}

              {error && <div className="admission-message admission-error-message">{error}</div>}
              {successMessage && <div className="admission-message admission-success-message">{successMessage}</div>}

              <button onClick={handleMotherSubmit} className="admission-btn admission-primary-btn admission-submit-btn" disabled={loading || !motherExtractionSuccess}>
                {loading ? 'Processing...' : 'Submit & Generate ID Card'}
              </button>
            </div>
          </div>
        )}

        {/* Step 5: ID Card */}
        {showIdCard && (
          <div className="admission-step-content">
            <div className="id-card-generation-section">
              <div className="id-card-success-header">
                <div className="id-card-success-icon">🎉</div>
                <h2>Application Submitted Successfully!</h2>
                <p>Your virtual student ID card has been generated</p>
              </div>

              <div ref={idCardRef} className="student-id-card">
                <div className="student-id-card-header">
                  <div className="student-id-school-logo">
                    <div className="student-id-logo-placeholder">🏫</div>
                  </div>
                  <div className="student-id-school-info">
                    <h3>SmartFlows Academy</h3>
                    <p>Empowering Future Leaders</p>
                  </div>
                </div>
                
                <div className="student-id-card-body">
                  <div className="student-id-photo-section">
                    <div className="student-id-photo-container">
                      <img 
                        src={studentPhoto || 'https://via.placeholder.com/120x150?text=Photo'} 
                        alt="Student" 
                        className="student-id-photo" 
                      />
                      <div className="student-id-badge">STUDENT</div>
                    </div>
                  </div>
                  
                  <div className="student-id-info-section">
                    <div className="student-id-info-container">
                      <div className="student-id-info-row">
                        <span className="student-id-info-label">Name:</span>
                        <span className="student-id-info-value">{formData.name}</span>
                      </div>
                      <div className="student-id-info-row">
                        <span className="student-id-info-label">DOB:</span>
                        <span className="student-id-info-value">{formData.dob}</span>
                      </div>
                      <div className="student-id-info-row">
                        <span className="student-id-info-label">Gender:</span>
                        <span className="student-id-info-value">{formData.gender}</span>
                      </div>
                      <div className="student-id-info-row">
                        <span className="student-id-info-label">Aadhaar:</span>
                        <span className="student-id-info-value">{formData.aadhaar_number}</span>
                      </div>
                      <div className="student-id-info-row">
                        <span className="student-id-info-label">Father's Name:</span>
                        <span className="student-id-info-value">{formData.father_name}</span>
                      </div>
                      <div className="student-id-info-row">
                        <span className="student-id-info-label">Blood Group:</span>
                        <span className="student-id-info-value student-id-blood-group">{formData.blood_group}</span>
                      </div>
                      <div className="student-id-info-row">
                        <span className="student-id-info-label">Class:</span>
                        <span className="student-id-info-value">{formData.class_grade}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="student-id-card-footer">
                  <div className="student-id-validity">
                    <span>Valid until: Dec 31, 2025</span>
                    <span>ID: {formData.aadhaar_number?.slice(-4) || 'N/A'}</span>
                  </div>
                  <div className="student-id-signature-section">
                    <div className="student-id-signature-line"></div>
                    <span>Authorized Signature</span>
                  </div>
                </div>
              </div>

              <button onClick={downloadIdCard} className="admission-btn admission-download-btn" disabled={loading}>
                📥 Download ID Card (PDF)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admissions;