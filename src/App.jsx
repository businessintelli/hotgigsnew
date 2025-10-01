import React, { useState, useEffect } from 'react';
import AIInterviewViewer from './components/AIInterviewViewer';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

// Modern UI Components
const Button = ({ children, variant = 'primary', size = 'md', className = '', onClick, ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500',
    secondary: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 shadow-sm focus:ring-gray-500',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500'
  };
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = '', ...props }) => (
  <div className={`bg-white rounded-xl shadow-lg border border-gray-100 ${className}`} {...props}>
    {children}
  </div>
);

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800'
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Modern Navbar Component
const Navbar = ({ userType, setUserType }) => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">HG</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HotGigs
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium">Home</Link>
            <Link to="/jobs" className="text-gray-600 hover:text-gray-900 font-medium">Jobs</Link>
            {userType === 'candidate' && (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">Dashboard</Link>
                <Link to="/applications" className="text-gray-600 hover:text-gray-900 font-medium">My Applications</Link>
              </>
            )}
            {userType === 'recruiter' && (
              <>
                <Link to="/recruiter-dashboard" className="text-gray-600 hover:text-gray-900 font-medium">Dashboard</Link>
                <Link to="/post-job" className="text-gray-600 hover:text-gray-900 font-medium">Post Job</Link>
                <Link to="/candidates" className="text-gray-600 hover:text-gray-900 font-medium">Candidates</Link>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {!userType ? (
              <>
                <Button variant="ghost" onClick={() => setUserType('candidate')}>
                  Join as Candidate
                </Button>
                <Button onClick={() => setUserType('recruiter')}>
                  Join as Recruiter
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Badge variant="primary" className="capitalize">{userType}</Badge>
                <Button variant="ghost" onClick={() => setUserType(null)}>
                  Switch Role
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Modern Homepage Component
const Homepage = ({ userType, setUserType }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Find Your Dream Job with{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Power
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              HotGigs uses advanced AI to match you with perfect opportunities. Get personalized recommendations, 
              AI-powered interviews, and land your next role faster.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="xl" onClick={() => setUserType('candidate')} className="w-full sm:w-auto">
                🎯 Find Jobs as Candidate
              </Button>
              <Button variant="outline" size="xl" onClick={() => setUserType('recruiter')} className="w-full sm:w-auto">
                🚀 Hire Talent as Recruiter
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '10K+', label: 'Active Jobs' },
              { number: '5K+', label: 'Companies' },
              { number: '50K+', label: 'Candidates' },
              { number: '95%', label: 'Success Rate' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              AI-Powered Features
            </h2>
            <p className="text-xl text-gray-600">
              Experience the future of recruitment with our advanced AI technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🤖',
                title: 'Smart Matching',
                description: 'Our AI analyzes your skills and preferences to find perfect job matches.'
              },
              {
                icon: '📊',
                title: 'Real-time Analytics',
                description: 'Get instant insights on your application performance and market trends.'
              },
              {
                icon: '⚡',
                title: 'Lightning Fast',
                description: 'Streamlined process gets you hired 3x faster than traditional methods.'
              }
            ].map((feature, index) => (
              <Card key={index} className="p-8 text-center hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
      {showInterviewModal && <AIInterviewViewer candidate={{}} onClose={() => setShowInterviewModal(false)} />}
    </div>
  );
};

// Jobs Page Component
const JobsPage = ({ userType }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setJobs([
        {
          id: 1,
          title: 'Senior Software Engineer',
          company: 'TechCorp Inc.',
          location: 'San Francisco, CA',
          remote: true,
          salary: { min: 120000, max: 180000, currency: 'USD' },
          description: 'Join our team to build scalable web applications using modern technologies.',
          requirements: ['JavaScript', 'React', 'Node.js', 'AWS'],
          posted: '2 days ago',
          applicants: 45
        },
        {
          id: 2,
          title: 'Product Manager',
          company: 'InnovateCo',
          location: 'New York, NY',
          remote: false,
          salary: { min: 100000, max: 150000, currency: 'USD' },
          description: 'Lead product strategy and work with cross-functional teams.',
          requirements: ['Product Strategy', 'Analytics', 'Leadership', 'Agile'],
          posted: '1 week ago',
          applicants: 32
        },
        {
          id: 3,
          title: 'Data Scientist',
          company: 'DataTech Solutions',
          location: 'Austin, TX',
          remote: true,
          salary: { min: 90000, max: 140000, currency: 'USD' },
          description: 'Analyze complex datasets and build predictive models.',
          requirements: ['Python', 'Machine Learning', 'SQL', 'Statistics'],
          posted: '3 days ago',
          applicants: 28
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading amazing opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {userType === 'recruiter' ? 'Manage Job Postings' : 'Discover Your Next Opportunity'}
          </h1>
          <p className="text-gray-600">
            {userType === 'recruiter' 
              ? 'View and manage your job postings, track applications, and find the best candidates.'
              : 'Browse through our curated list of opportunities matched to your skills and preferences.'
            }
          </p>
        </div>

        {userType === 'recruiter' && (
          <div className="mb-6">
            <Button size="lg" className="mb-4">
              + Post New Job
            </Button>
          </div>
        )}

        <div className="grid gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="p-6 hover:shadow-xl transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <span className="font-medium">{job.company}</span>
                    <span className="mx-2">•</span>
                    <span>{job.location}</span>
                    {job.remote && (
                      <>
                        <span className="mx-2">•</span>
                        <Badge variant="success">Remote</Badge>
                      </>
                    )}
                  </div>
                  <div className="text-green-600 font-semibold">
                    ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} {job.salary.currency}
                  </div>
                </div>
                <div className="flex flex-col items-end mt-4 md:mt-0">
                  <div className="text-sm text-gray-500 mb-2">{job.posted}</div>
                  <div className="text-sm text-gray-500">{job.applicants} applicants</div>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{job.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {job.requirements.map((skill, index) => (
                  <Badge key={index} variant="primary">{skill}</Badge>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                {userType === 'candidate' ? (
                  <>
                    <Button className="flex-1">Apply Now</Button>
                    <Button variant="outline" className="flex-1">Save Job</Button>
                  </>
                ) : (
                  <>
                    <Button className="flex-1">View Applications ({job.applicants})</Button>
                    <Button variant="outline" className="flex-1">Edit Job</Button>
                    <Button variant="ghost">Analytics</Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
      {showInterviewModal && <AIInterviewViewer candidate={{}} onClose={() => setShowInterviewModal(false)} />}
    </div>
  );
};

// Candidate Dashboard
const CandidateDashboard = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setRecommendations([
        {
          jobId: 1,
          score: 90,
          job: {
            title: 'Senior Software Engineer',
            company: 'TechCorp Inc.',
            location: 'San Francisco, CA',
            remote: true,
            salary: { min: 120000, max: 180000, currency: 'USD' }
          },
          matchReasons: [
            { type: 'skill', text: 'Your JavaScript skills match this role', score: 0.9 },
            { type: 'experience', text: 'Your 8+ years experience fits perfectly', score: 0.85 }
          ]
        },
        {
          jobId: 2,
          score: 75,
          job: {
            title: 'Product Manager',
            company: 'InnovateCo',
            location: 'New York, NY',
            remote: false,
            salary: { min: 100000, max: 150000, currency: 'USD' }
          },
          matchReasons: [
            { type: 'skill', text: 'Your leadership experience is valuable', score: 0.8 }
          ]
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating your personalized recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your AI-Powered Dashboard</h1>
          <p className="text-gray-600">
            Personalized job recommendations based on your skills, experience, and preferences.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Profile Views', value: '127', change: '+12%', color: 'blue' },
            { title: 'Applications', value: '8', change: '+3', color: 'green' },
            { title: 'AI Matches', value: '23', change: '+5', color: 'purple' },
            { title: 'Interview Invites', value: '3', change: '+2', color: 'orange' }
          ].map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`text-sm font-medium text-${stat.color}-600`}>
                  {stat.change}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* AI Recommendations */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🤖 AI Job Recommendations</h2>
          <div className="grid gap-6">
            {recommendations.map((rec, index) => (
              <Card key={index} className="p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{rec.job.title}</h3>
                      <Badge variant="success" className="ml-3">
                        {rec.score}% Match
                      </Badge>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <span className="font-medium">{rec.job.company}</span>
                      <span className="mx-2">•</span>
                      <span>{rec.job.location}</span>
                      {rec.job.remote && (
                        <>
                          <span className="mx-2">•</span>
                          <Badge variant="primary">Remote</Badge>
                        </>
                      )}
                    </div>
                    <div className="text-green-600 font-semibold mb-4">
                      ${rec.job.salary.min.toLocaleString()} - ${rec.job.salary.max.toLocaleString()} {rec.job.salary.currency}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Why this matches you:</h4>
                  <div className="space-y-2">
                    {rec.matchReasons.map((reason, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        {reason.text}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1">Apply Now</Button>
                  <Button variant="outline" className="flex-1">Get AI Explanation</Button>
                  <Button variant="ghost">Save for Later</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      {showInterviewModal && <AIInterviewViewer candidate={{}} onClose={() => setShowInterviewModal(false)} />}
    </div>
  );
};

// Recruiter Dashboard
const RecruiterDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setApplications([
        {
          id: 1,
          candidate: 'John Smith',
          job: 'Senior Software Engineer',
          appliedDate: '2024-01-15',
          status: 'pending',
          aiScore: 92,
          skills: ['JavaScript', 'React', 'Node.js'],
          experience: '8 years',
          location: 'San Francisco, CA'
        },
        {
          id: 2,
          candidate: 'Sarah Johnson',
          job: 'Product Manager',
          appliedDate: '2024-01-14',
          status: 'interview_scheduled',
          aiScore: 87,
          skills: ['Product Strategy', 'Analytics', 'Leadership'],
          experience: '6 years',
          location: 'New York, NY'
        },
        {
          id: 3,
          candidate: 'Mike Chen',
          job: 'Data Scientist',
          appliedDate: '2024-01-13',
          status: 'reviewed',
          aiScore: 78,
          skills: ['Python', 'Machine Learning', 'SQL'],
          experience: '4 years',
          location: 'Austin, TX'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { variant: 'warning', text: 'Pending Review' },
      reviewed: { variant: 'primary', text: 'Reviewed' },
      interview_scheduled: { variant: 'success', text: 'Interview Scheduled' },
      rejected: { variant: 'danger', text: 'Rejected' }
    };
    const config = statusMap[status] || statusMap.pending;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your recruitment dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Recruiter Dashboard</h1>
          <p className="text-gray-600">
            Manage your job postings, review candidates, and track your hiring pipeline with AI insights.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Active Jobs', value: '12', change: '+2', color: 'blue' },
            { title: 'Total Applications', value: '156', change: '+23', color: 'green' },
            { title: 'Interviews Scheduled', value: '8', change: '+3', color: 'purple' },
            { title: 'Hires This Month', value: '4', change: '+1', color: 'orange' }
          ].map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`text-sm font-medium text-${stat.color}-600`}>
                  {stat.change}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Applications */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">🎯 Recent Applications</h2>
            <Button>View All Applications</Button>
          </div>
          
          <div className="grid gap-6">
            {applications.map((app) => (
              <Card key={app.id} className="p-6 hover:shadow-xl transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{app.candidate}</h3>
                      <Badge variant="success" className="ml-3">
                        AI Score: {app.aiScore}%
                      </Badge>
                      {getStatusBadge(app.status)}
                    </div>
                    <div className="text-gray-600 mb-2">
                      Applied for: <span className="font-medium">{app.job}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span>{app.experience} experience</span>
                      <span className="mx-2">•</span>
                      <span>{app.location}</span>
                      <span className="mx-2">•</span>
                      <span>Applied {app.appliedDate}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {app.skills.map((skill, index) => (
                        <Badge key={index} variant="primary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0 lg:ml-6">
                    <Button size="sm">View Profile</Button>
                    <Button variant="outline" size="sm">Schedule Interview</Button>
                    <Button variant="ghost" size="sm" onClick={() => setShowInterviewModal(true)}>AI Analysis</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                + Post New Job
              </Button>
              <Button variant="outline" className="w-full justify-start">
                📊 View Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start">
                👥 Manage Team
              </Button>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🤖 AI Insights</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Top performing job: "Senior Software Engineer"
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Best candidate source: LinkedIn (45% success rate)
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                Recommended: Increase salary range by 8% for faster hiring
              </div>
            </div>
          </Card>
        </div>
      </div>
      {showInterviewModal && <AIInterviewViewer candidate={{}} onClose={() => setShowInterviewModal(false)} />}
    </div>
  );
};

// Main App Component
function App() {
  const [userType, setUserType] = useState(null); // null, 'candidate', 'recruiter'

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar userType={userType} setUserType={setUserType} />
        
        <Routes>
          <Route path="/" element={<Homepage userType={userType} setUserType={setUserType} />} />
          <Route path="/jobs" element={<JobsPage userType={userType} />} />
          <Route path="/dashboard" element={<CandidateDashboard />} />
          <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
          <Route path="/applications" element={<CandidateDashboard />} />
          <Route path="/post-job" element={<RecruiterDashboard />} />
          <Route path="/candidates" element={<RecruiterDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
