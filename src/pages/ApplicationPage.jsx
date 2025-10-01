import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  MapPin,
  DollarSign,
  Building,
  Clock,
  Users
} from 'lucide-react';

const ApplicationPage = () => {
  const { jobId } = useParams();
  const { user, uploadResume } = useAuth();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const response = await axios.get(`/api/v1/jobs/${jobId}`);
      setJob(response.data);
    } catch (error) {
      console.error('Failed to fetch job:', error);
      setError('Job not found');
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (file) => {
    if (!file) return;
    
    setSubmitting(true);
    const result = await uploadResume(file);
    
    if (result.success) {
      setResumeFile(null); // Clear file input since it's now uploaded to profile
    } else {
      setError(result.error);
    }
    setSubmitting(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a PDF, DOC, DOCX, or TXT file');
        return;
      }
      
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      setResumeFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Upload resume if a new one is selected
      if (resumeFile) {
        const uploadResult = await uploadResume(resumeFile);
        if (!uploadResult.success) {
          setError(uploadResult.error);
          setSubmitting(false);
          return;
        }
      }

      // Check if user has a resume
      if (!user.profile?.resume && !resumeFile) {
        setError('Please upload a resume to apply for this job');
        setSubmitting(false);
        return;
      }

      // Submit application
      const response = await axios.post(`/api/v1/jobs/${jobId}/apply`, {
        coverLetter
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Application failed:', error);
      setError(error.response?.data?.error || 'Application failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-4">The job you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/jobs')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Jobs
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center max-w-md mx-auto p-8">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your application for <strong>{job.title}</strong> at <strong>{job.company.name}</strong> has been successfully submitted.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            You will be redirected to your dashboard shortly...
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={job.company.logo}
                  alt={job.company.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-gray-600">{job.company.name}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">
                    {job.location}
                    {job.remote && <span className="text-green-600 ml-1">(Remote)</span>}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm">
                    ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} {job.salary.currency}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-gray-600">
                  <Building className="w-4 h-4" />
                  <span className="text-sm">{job.company.size} employees</span>
                </div>

                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {job.requirements.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-2">Job Description</h4>
                <p className="text-sm text-gray-600">{job.description}</p>
              </div>
            </div>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Apply for this Position</h2>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2 mb-6">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Resume Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Resume</h3>
                  
                  {user.profile?.resume ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-6 h-6 text-green-600" />
                        <div>
                          <p className="font-medium text-green-800">Current Resume</p>
                          <p className="text-sm text-green-600">
                            {user.profile.resume.originalName} 
                            <span className="ml-2">
                              (Uploaded {new Date(user.profile.resume.uploadDate).toLocaleDateString()})
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="w-6 h-6 text-yellow-600" />
                        <div>
                          <p className="font-medium text-yellow-800">No Resume Found</p>
                          <p className="text-sm text-yellow-600">Please upload a resume to apply for this job.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Upload New Resume */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {user.profile?.resume ? 'Upload New Resume (Optional)' : 'Upload Resume *'}
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <div className="text-sm text-gray-600 mb-2">
                        <label htmlFor="resume-upload" className="cursor-pointer text-blue-600 hover:text-blue-500">
                          Click to upload
                        </label>
                        <span> or drag and drop</span>
                      </div>
                      <p className="text-xs text-gray-500">PDF, DOC, DOCX, or TXT (max 10MB)</p>
                      <input
                        id="resume-upload"
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                    
                    {resumeFile && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <span className="text-sm text-blue-800">{resumeFile.name}</span>
                          <button
                            type="button"
                            onClick={() => setResumeFile(null)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cover Letter */}
                <div>
                  <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter (Optional)
                  </label>
                  <textarea
                    id="coverLetter"
                    rows={6}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    A well-written cover letter can help your application stand out.
                  </p>
                </div>

                {/* Application Preview */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Application Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Position:</span>
                      <span className="font-medium">{job.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Company:</span>
                      <span className="font-medium">{job.company.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Resume:</span>
                      <span className="font-medium">
                        {resumeFile ? 'New resume selected' : 
                         user.profile?.resume ? 'Current resume' : 'Not uploaded'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cover Letter:</span>
                      <span className="font-medium">
                        {coverLetter ? 'Included' : 'Not included'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || (!user.profile?.resume && !resumeFile)}
                    className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationPage;
