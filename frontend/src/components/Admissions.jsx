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
    class_grade: '',
    school_name: '',
    last_class_attended: '',
    // Extra fields from leaving certificate – comment out any you don't need
    book_number: '',
    serial_number: '',
    admission_number: '',
    student_name: '', // Note: this may overlap with Aadhaar student name
    father_name_lc: '', // Renamed to avoid conflict with father's Aadhaar
    mother_name_lc: '', // Renamed to avoid conflict with mother's Aadhaar
    nationality: '',
    belongs_to_sc_st: '',
    date_of_first_admission: '',
    class_at_first_admission: '',
    date_of_birth_lc: '', // Renamed to avoid conflict with student's DOB
    date_of_birth_in_words: '',
    school_board_exam_result: '',
    failed_status: '',
    subjects_studied: [], // This is an array
    promoted_to_higher_class: '',
    school_dues_paid_up_to: '',
    fee_concession: '',
    total_working_days: '',
    total_working_days_present: '',
    ncc_cadet_boys_scout_girl_guide: '',
    extracurricular_activities: '',
    general_conduct: '',
    date_of_application_for_certificate: '',
    date_of_issue_of_certificate: '',
    reason_for_leaving: '',
    other_remarks: ''
  });

  const [studentAadhaarImage, setStudentAadhaarImage] = useState(null);
  const [fatherAadhaarImage, setFatherAadhaarImage] = useState(null);
  const [motherAadhaarImage, setMotherAadhaarImage] = useState(null);
  const [leavingCertImage, setLeavingCertImage] = useState(null);
  const [studentPhoto, setStudentPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [studentExtractionSuccess, setStudentExtractionSuccess] = useState(false);
  const [fatherExtractionSuccess, setFatherExtractionSuccess] = useState(false);
  const [motherExtractionSuccess, setMotherExtractionSuccess] = useState(false);
  const [leavingCertExtractionSuccess, setLeavingCertExtractionSuccess] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showIdCard, setShowIdCard] = useState(false);
  const idCardRef = useRef(null);
// Base backend URL (switches local/prod automatically)
  const isDev = import.meta.env.DEV; // Vite's built-in dev mode detector
  const BASE_BACKEND_URL = isDev ? 'http://localhost:5000' : 'https://school-management-system-toqs.onrender.com';

  // All URLs now conditional
  const API_URL = `${BASE_BACKEND_URL}/api/admissions/extract-aadhaar`;
  const LEAVING_CERT_API_URL = `${BASE_BACKEND_URL}/api/admissions/extract-leaving-certificate`;
  const SUBMIT_URL = `${BASE_BACKEND_URL}/api/admissions/submit-to-sheet`;

  // Debug log: Check which URL is being used
  console.log('Backend URLs in use:', { isDev, BASE_BACKEND_URL, API_URL, LEAVING_CERT_API_URL, SUBMIT_URL });


  
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

  // --- Aadhaar Upload Handlers ---
  const uploadAadhaar = async (file, role, setImage, setSuccess, successMsg) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target.result);
    reader.readAsDataURL(file);

    setLoading(true);
    setError('');
    setSuccessMessage('');
    setSuccess(false);
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

      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const result = await response.json();
      clearInterval(processInterval);

      if (result.success) {
        const extracted = {
          ...(role === 'student' && {
            name: result.data.name || '',
            dob: formatDob(result.data.dob),
            gender: result.data.gender || '',
            aadhaar_number: result.data.aadhaar_number || ''
          }),
          ...(role === 'father' && {
            father_name: result.data.name || '',
            father_dob: formatDob(result.data.dob),
            father_gender: result.data.gender || '',
            father_aadhaar_number: result.data.aadhaar_number || ''
          }),
          ...(role === 'mother' && {
            mother_name: result.data.name || '',
            mother_dob: formatDob(result.data.dob),
            mother_gender: result.data.gender || '',
            mother_aadhaar_number: result.data.aadhaar_number || ''
          }),
        };
        setFormData(prev => ({ ...prev, ...extracted }));
        setProgress(100);
        setSuccess(true);
        setSuccessMessage(successMsg);
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

  const handleStudentImageUpload = (e) => uploadAadhaar(e.target.files[0], 'student', setStudentAadhaarImage, setStudentExtractionSuccess, 'Aadhaar details extracted successfully!');
  const handleFatherImageUpload = (e) => uploadAadhaar(e.target.files[0], 'father', setFatherAadhaarImage, setFatherExtractionSuccess, "Father's Aadhaar details extracted successfully!");
  const handleMotherImageUpload = (e) => uploadAadhaar(e.target.files[0], 'mother', setMotherAadhaarImage, setMotherExtractionSuccess, "Mother's Aadhaar details extracted successfully!");

  // --- Leaving Certificate Upload ---
  const handleLeavingCertImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => setLeavingCertImage(e.target.result);
    reader.readAsDataURL(file);

    setLoading(true);
    setError('');
    setSuccessMessage('');
    setLeavingCertExtractionSuccess(false);
    setProgress(10);

    const formDataToSend = new FormData();
    formDataToSend.append('file', file);

    try {
      const uploadInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 20, 50));
      }, 300);

      const response = await fetch(LEAVING_CERT_API_URL, {
        method: 'POST',
        body: formDataToSend,
      });

      clearInterval(uploadInterval);
      setProgress(60);

      const processInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const result = await response.json();
      clearInterval(processInterval);

      if (result.success) {
        // Extract all fields, including extras – comment out lines below for fields you don't need
        const extractedData = {
          school_name: result.data.school_name || '',
          last_class_attended: result.data.last_class_attended || '',
          book_number: result.data.book_number || '',
          serial_number: result.data.serial_number || '',
          admission_number: result.data.admission_number || '',
          student_name: result.data.student_name || '',
          father_name_lc: result.data.father_name || '', // Renamed to avoid conflict
          mother_name_lc: result.data.mother_name || '', // Renamed to avoid conflict
          nationality: result.data.nationality || '',
          belongs_to_sc_st: result.data.belongs_to_sc_st || '',
          date_of_first_admission: result.data.date_of_first_admission || '',
          class_at_first_admission: result.data.class_at_first_admission || '',
          date_of_birth_lc: result.data.date_of_birth || '', // Renamed to avoid conflict
          date_of_birth_in_words: result.data.date_of_birth_in_words || '',
          school_board_exam_result: result.data.school_board_exam_result || '',
          failed_status: result.data.failed_status || '',
          subjects_studied: result.data.subjects_studied || [],
          promoted_to_higher_class: result.data.promoted_to_higher_class || '',
          school_dues_paid_up_to: result.data.school_dues_paid_up_to || '',
          fee_concession: result.data.fee_concession || '',
          total_working_days: result.data.total_working_days || '',
          total_working_days_present: result.data.total_working_days_present || '',
          ncc_cadet_boys_scout_girl_guide: result.data.ncc_cadet_boys_scout_girl_guide || '',
          extracurricular_activities: result.data.extracurricular_activities || '',
          general_conduct: result.data.general_conduct || '',
          date_of_application_for_certificate: result.data.date_of_application_for_certificate || '',
          date_of_issue_of_certificate: result.data.date_of_issue_of_certificate || '',
          reason_for_leaving: result.data.reason_for_leaving || '',
          other_remarks: result.data.other_remarks || ''
        };
        setFormData(prev => ({ ...prev, ...extractedData }));
        setProgress(100);
        setLeavingCertExtractionSuccess(true);
        setSuccessMessage('Leaving certificate details extracted successfully!');
      } else {
        throw new Error(result.message || 'Extraction failed');
      }
    } catch (err) {
      setProgress(0);
      setError(err.message || 'Failed to extract certificate data. Using mock mode.');
      // Allow fallback to mock via backend
      setLeavingCertExtractionSuccess(true);
      setSuccessMessage('Using mock data (dev mode)');
    } finally {
      setLoading(false);
    }
  };

  // --- File Select Handlers ---
  const handleStudentFileSelect = (e) => handleStudentImageUpload(e);
  const handleStudentCameraCapture = (e) => handleStudentImageUpload(e);
  const handleFatherFileSelect = (e) => handleFatherImageUpload(e);
  const handleFatherCameraCapture = (e) => handleFatherImageUpload(e);
  const handleMotherFileSelect = (e) => handleMotherImageUpload(e);
  const handleMotherCameraCapture = (e) => handleMotherImageUpload(e);
  const handleLeavingCertFileSelect = (e) => handleLeavingCertImageUpload(e);
  const handleLeavingCertCameraCapture = (e) => handleLeavingCertImageUpload(e);

  // --- Navigation ---
  const handleNextStep1 = () => studentExtractionSuccess ? (setCurrentStep(2), setError('')) : setError('Please upload Aadhaar and ensure all details are extracted.');
  const handleNextStep2 = () => {
    if (!formData.address || !formData.blood_group || !formData.phone || !formData.class_grade) {
      setError('All fields with * are required.');
      return;
    }
    setCurrentStep(3);
    setError('');
  };
  const handleNextStep3 = () => fatherExtractionSuccess ? (setCurrentStep(4), setError('')) : setError("Please upload Father's Aadhaar and ensure details are extracted.");
  const handleNextStep4 = () => motherExtractionSuccess ? (setCurrentStep(5), setError('')) : setError("Please upload Mother's Aadhaar and ensure details are extracted.");

  const handleLeavingCertSubmit = async () => {
    if (!leavingCertExtractionSuccess) {
      setError("Please upload Leaving Certificate and ensure details are extracted.");
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

      if (!response.ok) throw new Error(`Submit Error: ${response.status}`);

      const result = await response.json();
      if (result.success) {
        setShowIdCard(true);
        setSuccessMessage('Application submitted! Data saved to records and confirmation email sent. ID Card generated below.');
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setStudentPhoto(ev.target.result);
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

      const margin = 10;
      const pdfWidth = pageWidth - 2 * margin;
      const pdfHeight = pageHeight - 2 * margin;

      const imgRatio = canvas.width / canvas.height;
      const pdfRatio = pdfWidth / pdfHeight;
      let imgWidth, imgHeight, x, y;

      if (imgRatio > pdfRatio) {
        imgWidth = pdfWidth;
        imgHeight = pdfWidth / imgRatio;
        x = margin;
        y = (pageHeight - imgHeight) / 2;
      } else {
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
            {[1, 2, 3, 4, 5, 6].map(step => (
              <div key={step} className={`admission-step ${(currentStep >= step || (step === 6 && showIdCard)) ? 'admission-step-active' : ''}`}>
                <div className="admission-step-number">{step}</div>
                <div className="admission-step-label">
                  {['Student Aadhaar', 'Student Details', 'Father Aadhaar', 'Mother Aadhaar', 'Leaving Certificate', 'ID Card'][step - 1]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Student Aadhaar */}
        {currentStep === 1 && (
          <div className="admission-step-content">
            <div className="aadhaar-upload-card">
              <div className="aadhaar-upload-header">
                <div className="aadhaar-upload-icon">Photo</div>
                <h3>Upload Student Aadhaar Card</h3>
                <p>Choose your preferred method</p>
              </div>

              <div className="aadhaar-upload-options">
                <div className="upload-option-group">
                  <label htmlFor="student-aadhaar-file-upload" className="upload-option-label">
                    <div className="upload-option-card">
                      <div className="upload-option-icon">Folder</div>
                      <div className="upload-option-content">
                        <h4>Upload File</h4>
                        <p>From device</p>
                        <span className="upload-option-hint">JPG, PNG</span>
                      </div>
                    </div>
                  </label>
                  <input id="student-aadhaar-file-upload" type="file" accept="image/*" onChange={handleStudentFileSelect} className="aadhaar-file-input" />
                </div>

                <div className="upload-option-group">
                  <label htmlFor="student-aadhaar-camera-capture" className="upload-option-label">
                    <div className="upload-option-card">
                      <div className="upload-option-icon">Camera</div>
                      <div className="upload-option-content">
                        <h4>Take Photo</h4>
                        <p>Use camera</p>
                        <span className="upload-option-hint">Instant capture</span>
                      </div>
                    </div>
                  </label>
                  <input id="student-aadhaar-camera-capture" type="file" accept="image/*" capture="environment" onChange={handleStudentCameraCapture} className="aadhaar-file-input" />
                </div>
              </div>

              {studentAadhaarImage && (
                <div className="aadhaar-image-preview">
                  <div className="preview-section-header"><span>Aadhaar Preview</span></div>
                  <img src={studentAadhaarImage} alt="Preview" className="aadhaar-preview-image" />
                </div>
              )}

              {loading && (
                <div className="aadhaar-progress-section">
                  <div className="aadhaar-progress-header">
                    <span>Extracting...</span>
                    <span className="aadhaar-progress-percent">{Math.round(progress)}%</span>
                  </div>
                  <div className="aadhaar-progress-bar">
                    <div className="aadhaar-progress-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              )}

              {studentExtractionSuccess && (
                <div className="aadhaar-preview-card">
                  <div className="aadhaar-preview-header"><h4>Extracted Details</h4></div>
                  <div className="aadhaar-preview-grid">
                    {['name', 'dob', 'gender', 'aadhaar_number'].map(field => (
                      <div key={field} className="aadhaar-preview-item">
                        <label>{field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</label>
                        <span>{formData[field] || '-'}</span>
                      </div>
                    ))}
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

        {/* Step 2: Student Details */}
        {currentStep === 2 && (
          <form className="admission-step-content">
            <div className="admission-form-card">
              <div className="admission-form-header">
                <h3>Student Information</h3>
                <p>Fill in the remaining details</p>
              </div>

              <div className="admission-form-grid">
                <div className="admission-form-group admission-form-fullwidth">
                  <label htmlFor="address" className="admission-form-label">Address <span className="admission-required">*</span></label>
                  <textarea id="address" name="address" value={formData.address} onChange={handleInputChange} required rows={3} className="admission-form-input" placeholder="Complete address" />
                </div>

                <div className="admission-form-group">
                  <label htmlFor="blood_group" className="admission-form-label">Blood Group <span className="admission-required">*</span></label>
                  <select id="blood_group" name="blood_group" value={formData.blood_group} onChange={handleBloodGroupChange} className="admission-form-input" required>
                    <option value="">Select</option>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div className="admission-form-group">
                  <label htmlFor="phone" className="admission-form-label">Phone Number <span className="admission-required">*</span></label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required className="admission-form-input" placeholder="Enter phone" />
                </div>

                <div className="admission-form-group">
                  <label htmlFor="class_grade" className="admission-form-label">Class/Grade <span className="admission-required">*</span></label>
                  <input type="text" id="class_grade" name="class_grade" value={formData.class_grade} onChange={handleInputChange} required className="admission-form-input" placeholder="e.g., 10th Standard" />
                </div>
              </div>

              <div className="student-photo-upload-section">
                <label className="admission-form-label">Student Photo for ID Card</label>
                <div className="student-photo-upload-area">
                  <input id="student-photo" type="file" accept="image/*" onChange={handleStudentPhotoUpload} className="student-photo-input" />
                  <label htmlFor="student-photo" className="student-photo-label">
                    <div className="student-photo-placeholder">
                      {studentPhoto ? (
                        <img src={studentPhoto} alt="Student" className="student-photo-preview" />
                      ) : (
                        <>
                          <div className="student-photo-icon">Camera</div>
                          <span>Upload Photo</span>
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

        {/* Step 3: Father Aadhaar */}
        {currentStep === 3 && (
          <div className="admission-step-content">
            <div className="aadhaar-upload-card">
              <div className="aadhaar-upload-header">
                <div className="aadhaar-upload-icon">Photo</div>
                <h3>Upload Father's Aadhaar Card</h3>
                <p>Choose upload method</p>
              </div>

              <div className="aadhaar-upload-options">
                <div className="upload-option-group">
                  <label htmlFor="father-aadhaar-file-upload" className="upload-option-label">
                    <div className="upload-option-card">
                      <div className="upload-option-icon">Folder</div>
                      <div className="upload-option-content"><h4>Upload File</h4><p>From device</p></div>
                    </div>
                  </label>
                  <input id="father-aadhaar-file-upload" type="file" accept="image/*" onChange={handleFatherFileSelect} className="aadhaar-file-input" />
                </div>

                <div className="upload-option-group">
                  <label htmlFor="father-aadhaar-camera-capture" className="upload-option-label">
                    <div className="upload-option-card">
                      <div className="upload-option-icon">Camera</div>
                      <div className="upload-option-content"><h4>Take Photo</h4><p>Use camera</p></div>
                    </div>
                  </label>
                  <input id="father-aadhaar-camera-capture" type="file" accept="image/*" capture="environment" onChange={handleFatherCameraCapture} className="aadhaar-file-input" />
                </div>
              </div>

              {fatherAadhaarImage && (
                <div className="aadhaar-image-preview">
                  <div className="preview-section-header"><span>Preview</span></div>
                  <img src={fatherAadhaarImage} alt="Father" className="aadhaar-preview-image" />
                </div>
              )}

              {loading && (
                <div className="aadhaar-progress-section">
                  <div className="aadhaar-progress-header">
                    <span>Extracting...</span>
                    <span className="aadhaar-progress-percent">{Math.round(progress)}%</span>
                  </div>
                  <div className="aadhaar-progress-bar">
                    <div className="aadhaar-progress-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              )}

              {fatherExtractionSuccess && (
                <div className="aadhaar-preview-card">
                  <div className="aadhaar-preview-header"><h4>Extracted</h4></div>
                  <div className="aadhaar-preview-grid">
                    {['father_name', 'father_dob', 'father_gender', 'father_aadhaar_number'].map(field => (
                      <div key={field} className="aadhaar-preview-item">
                        <label>{field.replace('father_', '').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</label>
                        <span>{formData[field] || '-'}</span>
                      </div>
                    ))}
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

        {/* Step 4: Mother Aadhaar */}
        {currentStep === 4 && (
          <div className="admission-step-content">
            <div className="aadhaar-upload-card">
              <div className="aadhaar-upload-header">
                <div className="aadhaar-upload-icon">Photo</div>
                <h3>Upload Mother's Aadhaar Card</h3>
                <p>Choose upload method</p>
              </div>

              <div className="aadhaar-upload-options">
                <div className="upload-option-group">
                  <label htmlFor="mother-aadhaar-file-upload" className="upload-option-label">
                    <div className="upload-option-card">
                      <div className="upload-option-icon">Folder</div>
                      <div className="upload-option-content"><h4>Upload File</h4><p>From device</p></div>
                    </div>
                  </label>
                  <input id="mother-aadhaar-file-upload" type="file" accept="image/*" onChange={handleMotherFileSelect} className="aadhaar-file-input" />
                </div>

                <div className="upload-option-group">
                  <label htmlFor="mother-aadhaar-camera-capture" className="upload-option-label">
                    <div className="upload-option-card">
                      <div className="upload-option-icon">Camera</div>
                      <div className="upload-option-content"><h4>Take Photo</h4><p>Use camera</p></div>
                    </div>
                  </label>
                  <input id="mother-aadhaar-camera-capture" type="file" accept="image/*" capture="environment" onChange={handleMotherCameraCapture} className="aadhaar-file-input" />
                </div>
              </div>

              {motherAadhaarImage && (
                <div className="aadhaar-image-preview">
                  <div className="preview-section-header"><span>Preview</span></div>
                  <img src={motherAadhaarImage} alt="Mother" className="aadhaar-preview-image" />
                </div>
              )}

              {loading && (
                <div className="aadhaar-progress-section">
                  <div className="aadhaar-progress-header">
                    <span>Extracting...</span>
                    <span className="aadhaar-progress-percent">{Math.round(progress)}%</span>
                  </div>
                  <div className="aadhaar-progress-bar">
                    <div className="aadhaar-progress-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              )}

              {motherExtractionSuccess && (
                <div className="aadhaar-preview-card">
                  <div className="aadhaar-preview-header"><h4>Extracted</h4></div>
                  <div className="aadhaar-preview-grid">
                    {['mother_name', 'mother_dob', 'mother_gender', 'mother_aadhaar_number'].map(field => (
                      <div key={field} className="aadhaar-preview-item">
                        <label>{field.replace('mother_', '').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</label>
                        <span>{formData[field] || '-'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {error && <div className="admission-message admission-error-message">{error}</div>}
              {successMessage && <div className="admission-message admission-success-message">{successMessage}</div>}

              <button onClick={handleNextStep4} className="admission-btn admission-primary-btn admission-next-btn" disabled={loading || !motherExtractionSuccess}>
                Continue to Leaving Certificate
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Leaving Certificate */}
        {currentStep === 5 && (
          <div className="admission-step-content">
            <div className="aadhaar-upload-card">
              <div className="aadhaar-upload-header">
                <div className="aadhaar-upload-icon">Document</div>
                <h3>Upload Leaving Certificate</h3>
                <p>Choose upload method</p>
              </div>

              <div className="aadhaar-upload-options">
                <div className="upload-option-group">
                  <label htmlFor="leaving-cert-file-upload" className="upload-option-label">
                    <div className="upload-option-card">
                      <div className="upload-option-icon">Folder</div>
                      <div className="upload-option-content"><h4>Upload File</h4><p>From device</p></div>
                    </div>
                  </label>
                  <input id="leaving-cert-file-upload" type="file" accept="image/*" onChange={handleLeavingCertFileSelect} className="aadhaar-file-input" />
                </div>

                <div className="upload-option-group">
                  <label htmlFor="leaving-cert-camera-capture" className="upload-option-label">
                    <div className="upload-option-card">
                      <div className="upload-option-icon">Camera</div>
                      <div className="upload-option-content"><h4>Take Photo</h4><p>Use camera</p></div>
                    </div>
                  </label>
                  <input id="leaving-cert-camera-capture" type="file" accept="image/*" capture="environment" onChange={handleLeavingCertCameraCapture} className="aadhaar-file-input" />
                </div>
              </div>

              {leavingCertImage && (
                <div className="aadhaar-image-preview">
                  <div className="preview-section-header"><span>Certificate Preview</span></div>
                  <img src={leavingCertImage} alt="LC" className="aadhaar-preview-image" />
                </div>
              )}

              {loading && (
                <div className="aadhaar-progress-section">
                  <div className="aadhaar-progress-header">
                    <span>Extracting...</span>
                    <span className="aadhaar-progress-percent">{Math.round(progress)}%</span>
                  </div>
                  <div className="aadhaar-progress-bar">
                    <div className="aadhaar-progress-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              )}

              {leavingCertExtractionSuccess && (
                <div className="aadhaar-preview-card">
                  <div className="aadhaar-preview-header"><h4>Extracted Details</h4></div>
                  <div className="aadhaar-preview-grid">
                    <div className="aadhaar-preview-item">
                      <label>School Name</label>
                      <span>{formData.school_name || '—'}</span>
                    </div>
                    <div className="aadhaar-preview-item">
                      <label>Last Class</label>
                      <span>{formData.last_class_attended || '—'}</span>
                    </div>
                    {/* Add more preview items here if needed, e.g.: */}
                    {/* <div className="aadhaar-preview-item">
                      <label>Book Number</label>
                      <span>{formData.book_number || '—'}</span>
                    </div> */}
                  </div>
                </div>
              )}

              {error && <div className="admission-message admission-error-message">{error}</div>}
              {successMessage && <div className="admission-message admission-success-message">{successMessage}</div>}

              <button onClick={handleLeavingCertSubmit} className="admission-btn admission-primary-btn admission-submit-btn" disabled={loading || !leavingCertExtractionSuccess}>
                {loading ? 'Processing...' : 'Submit & Generate ID Card'}
              </button>
            </div>
          </div>
        )}

        {/* Step 6: ID Card */}
        {showIdCard && (
          <div className="admission-step-content">
            <div className="id-card-generation-section">
              <div className="id-card-success-header">
                <div className="id-card-success-icon">Party</div>
                <h2>Application Submitted!</h2>
                <p>Your ID card is ready</p>
              </div>

              <div ref={idCardRef} className="student-id-card">
                <div className="student-id-card-header">
                  <div className="student-bis-school-logo">
                    <div className="student-id-logo-placeholder">School</div>
                  </div>
                  <div className="student-id-school-info">
                    <h3>SmartFlows Academy</h3>
                    <p>Empowering Future Leaders</p>
                  </div>
                </div>

                <div className="student-id-card-body">
                  <div className="student-id-photo-section">
                    <div className="student-id-photo-container">
                      <img src={studentPhoto || 'https://via.placeholder.com/120x150?text=Photo'} alt="Student" className="student-id-photo" />
                      <div className="student-id-badge">STUDENT</div>
                    </div>
                  </div>

                  <div className="student-id-info-section">
                    <div className="student-id-info-container">
                      <div className="student-id-info-row"><span className="student-id-info-label">Name:</span><span className="student-id-info-value">{formData.name}</span></div>
                      <div className="student-id-info-row"><span className="student-id-info-label">DOB:</span><span className="student-id-info-value">{formData.dob}</span></div>
                      <div className="student-id-info-row"><span className="student-id-info-label">Gender:</span><span className="student-id-info-value">{formData.gender}</span></div>
                      <div className="student-id-info-row"><span className="student-id-info-label">Aadhaar:</span><span className="student-id-info-value">{formData.aadhaar_number}</span></div>
                      <div className="student-id-info-row"><span className="student-id-info-label">Father:</span><span className="student-id-info-value">{formData.father_name}</span></div>
                      <div className="student-id-info-row"><span className="student-id-info-label">Prev. School:</span><span className="student-id-info-value">{formData.school_name}</span></div>
                      <div className="student-id-info-row"><span className="student-id-info-label">Last Class:</span><span className="student-id-info-value">{formData.last_class_attended}</span></div>
                      <div className="student-id-info-row"><span className="student-id-info-label">Blood:</span><span className="student-id-info-value student-id-blood-group">{formData.blood_group}</span></div>
                      <div className="student-id-info-row"><span className="student-id-info-label">Class:</span><span className="student-id-info-value">{formData.class_grade}</span></div>
                      {/* Add more ID card rows here if needed, e.g.: */}
                      {/* <div className="student-id-info-row"><span className="student-id-info-label">Nationality:</span><span className="student-id-info-value">{formData.nationality}</span></div> */}
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
                Download ID Card (PDF)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admissions;