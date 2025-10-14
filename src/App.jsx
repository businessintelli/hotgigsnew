import React, { useState } from 'react';
import AIInterviewViewer from './components/AIInterviewViewer';
import { SignUpForm, SignInForm } from './components/AuthComponents';
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
const Navbar = ({ userType, isAuthenticated, onSignOut, onShowSignIn, onShowSignUp }) => {
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
            {isAuthenticated && userType === 'candidate' && (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">Dashboard</Link>
                <Link to="/applications" className="text-gray-600 hover:text-gray-900 font-medium">My Applications</Link>
              </>
            )}
            {isAuthenticated && userType === 'recruiter' && (
              <>
                <Link to="/recruiter-dashboard" className="text-gray-600 hover:text-gray-900 font-medium">Dashboard</Link>
                <Link to="/post-job" className="text-gray-600 hover:text-gray-900 font-medium">Post Job</Link>
                <Link to="/candidates" className="text-gray-600 hover:text-gray-900 font-medium">Candidates</Link>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Button variant="ghost" onClick={() => onShowSignUp('candidate')}>
                  Join as Candidate
                </Button>
                <Button onClick={() => onShowSignUp('recruiter')}>
                  Join as Recruiter
                </Button>
                <Button variant="outline" onClick={onShowSignIn} className="ml-2">
                  Sign In
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Badge variant="primary">
                  {userType === 'candidate' ? 'Candidate' : 'Recruiter'}
                </Badge>
                <Button variant="ghost" size="sm" onClick={onSignOut}>
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

function App() {
  const [userType, setUserType] = useState(null); // 'candidate' or 'recruiter'
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [signUpType, setSignUpType] = useState(null); // 'candidate' or 'recruiter'
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleShowSignUp = (type) => {
    setSignUpType(type);
    setShowSignUp(true);
  };

  const handleSignInSuccess = (type) => {
    setUserType(type);
    setIsAuthenticated(true);
    setShowSignIn(false);
    setShowSignUp(false);
  };

  const handleSignOut = () => {
    setUserType(null);
    setIsAuthenticated(false);
  };

  const handleCloseModals = () => {
    setShowSignUp(false);
    setShowSignIn(false);
  };

  const handleSwitchToSignIn = () => {
    setShowSignUp(false);
    setShowSignIn(true);
  };

  const handleSwitchToSignUp = () => {
    setShowSignIn(false);
    setSignUpType('candidate'); // Default to candidate
    setShowSignUp(true);
  };

  // Homepage Component
  const Homepage = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Find Your Dream Job with{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Power
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              HotGigs uses advanced AI to match you with perfect opportunities. Get personalized 
              recommendations, AI-powered interviews, and land your next role faster.
            </p>
            
            <div className="flex items-center justify-center space-x-6">
              <Button variant="primary" size="lg" onClick={() => handleShowSignUp('candidate')}>
                🎯 Find Jobs as Candidate
              </Button>
              <Button variant="outline" size="lg" onClick={() => handleShowSignUp('recruiter')}>
                🚀 Hire Talent as Recruiter
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900">10K+</div>
              <div className="text-gray-600">Active Jobs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">5K+</div>
              <div className="text-gray-600">Companies</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">50K+</div>
              <div className="text-gray-600">Candidates</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI-Powered Features */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">AI-Powered Features</h2>
            <p className="text-xl text-gray-600">
              Experience the future of recruitment with our advanced AI technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Smart Matching</h3>
              <p className="text-gray-600">
                Our AI analyzes your skills and preferences to find perfect job matches.
              </p>
            </Card>
            
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Real-time Analytics</h3>
              <p className="text-gray-600">
                Get instant insights on your application performance and market trends.
              </p>
            </Card>
            
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Lightning Fast</h3>
              <p className="text-gray-600">
                Streamlined process gets you hired 3x faster than traditional methods.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );

  // Jobs Page Component
  const JobsPage = () => {
    const jobs = [
      {
        id: 1,
        title: 'Senior Software Engineer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        remote: true,
        salary: '$120,000 - $180,000 USD',
        posted: '2 days ago',
        applicants: 45,
        description: 'Join our team to build scalable web applications using modern technologies.',
        skills: ['JavaScript', 'React', 'Node.js', 'AWS']
      },
      {
        id: 2,
        title: 'Product Manager',
        company: 'InnovateCo',
        location: 'New York, NY',
        remote: false,
        salary: '$100,000 - $150,000 USD',
        posted: '1 week ago',
        applicants: 32,
        description: 'Lead product strategy and work with cross-functional teams.',
        skills: ['Product Strategy', 'Analytics', 'Leadership', 'Agile']
      },
      {
        id: 3,
        title: 'Data Scientist',
        company: 'DataTech Solutions',
        location: 'Austin, TX',
        remote: true,
        salary: '$90,000 - $140,000 USD',
        posted: '3 days ago',
        applicants: 28,
        description: 'Analyze complex datasets and build predictive models.',
        skills: ['Python', 'Machine Learning', 'SQL', 'Statistics']
      }
    ];

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Discover Your Next Opportunity</h1>
            <p className="text-gray-600">
              Browse through our curated list of opportunities matched to your skills and preferences.
            </p>
          </div>
          
          <div className="space-y-6">
            {jobs.map(job => (
              <Card key={job.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                    <div className="flex items-center space-x-2 text-gray-600 mb-2">
                      <span>{job.company}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                      {job.remote && (
                        <>
                          <span>•</span>
                          <Badge variant="success">Remote</Badge>
                        </>
                      )}
                    </div>
                    <p className="text-lg font-semibold text-green-600 mb-2">{job.salary}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div>{job.posted}</div>
                    <div>{job.applicants} applicants</div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{job.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {job.skills.map(skill => (
                    <Badge key={skill} variant="primary">{skill}</Badge>
                  ))}
                </div>
                
                <div className="flex space-x-3">
                  {userType === 'candidate' ? (
                    <>
                      <Button>Apply Now</Button>
                      <Button variant="outline">Save Job</Button>
                    </>
                  ) : userType === 'recruiter' ? (
                    <>
                      <Button>View Applications ({job.applicants})</Button>
                      <Button variant="outline">Edit Job</Button>
                      <Button variant="ghost">Analytics</Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={() => handleShowSignUp('candidate')}>Apply Now</Button>
                      <Button variant="outline" onClick={() => handleShowSignUp('candidate')}>Save Job</Button>
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Candidate Dashboard Component
  const CandidateDashboard = () => (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Profile Views</p>
                <p className="text-2xl font-bold text-gray-900">127</p>
              </div>
              <div className="text-sm text-green-600">+12%</div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Applications</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
              <div className="text-sm text-green-600">+3</div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Matches</p>
                <p className="text-2xl font-bold text-gray-900">23</p>
              </div>
              <div className="text-sm text-green-600">+5</div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Interview Invites</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <div className="text-sm text-green-600">+2</div>
            </div>
          </Card>
        </div>

        {/* AI Job Recommendations */}
        <Card className="p-6">
          <div className="flex items-center mb-6">
            <span className="text-2xl mr-3">🤖</span>
            <h2 className="text-xl font-semibold text-gray-900">AI Job Recommendations</h2>
          </div>
          
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Senior Software Engineer</h3>
                  <p className="text-gray-600">TechCorp Inc. • San Francisco, CA • <Badge variant="success">Remote</Badge></p>
                  <p className="text-green-600 font-semibold mt-1">$120,000 - $180,000 USD</p>
                </div>
                <Badge variant="success" className="text-sm">90% Match</Badge>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Why this matches you:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Your JavaScript skills match this role</li>
                  <li>• Your 8+ years experience fits perfectly</li>
                </ul>
              </div>
              
              <div className="flex space-x-3">
                <Button>Apply Now</Button>
                <Button variant="outline">Get AI Explanation</Button>
                <Button variant="ghost">Save for Later</Button>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Product Manager</h3>
                  <p className="text-gray-600">InnovateCo • New York, NY</p>
                  <p className="text-green-600 font-semibold mt-1">$100,000 - $150,000 USD</p>
                </div>
                <Badge variant="warning" className="text-sm">75% Match</Badge>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Why this matches you:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Your leadership experience is valuable</li>
                </ul>
              </div>
              
              <div className="flex space-x-3">
                <Button>Apply Now</Button>
                <Button variant="outline">Get AI Explanation</Button>
                <Button variant="ghost">Save for Later</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  // Recruiter Dashboard Component
  const RecruiterDashboard = () => (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <div className="text-sm text-green-600">+2</div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
              <div className="text-sm text-green-600">+23</div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Interviews Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
              <div className="text-sm text-green-600">+3</div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hires</p>
                <p className="text-2xl font-bold text-gray-900">4</p>
              </div>
              <div className="text-sm text-green-600">+1</div>
            </div>
          </Card>
        </div>

        {/* Recent Applications */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Applications</h2>
          
          <div className="space-y-4">
            {[
              { name: 'Sarah Johnson', role: 'Senior Software Engineer', score: 92, date: '2 hours ago' },
              { name: 'Mike Chen', role: 'Data Scientist', score: 87, date: '5 hours ago' },
              { name: 'Emily Davis', role: 'Product Manager', score: 78, date: '1 day ago' }
            ].map((candidate, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <h3 className="font-medium text-gray-900">{candidate.name}</h3>
                    <p className="text-sm text-gray-600">{candidate.role}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="success">AI Score: {candidate.score}%</Badge>
                  <span className="text-sm text-gray-500">{candidate.date}</span>
                  <Button size="sm" onClick={() => setShowInterviewModal(true)}>
                    AI Analysis
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Interview Modal */}
        {showInterviewModal && (
          <AIInterviewViewer onClose={() => setShowInterviewModal(false)} />
        )}
      </div>
    </div>
  );

  return (
    <Router>
      <div className="App">
        <Navbar 
          userType={userType}
          isAuthenticated={isAuthenticated}
          onSignOut={handleSignOut}
          onShowSignIn={() => setShowSignIn(true)}
          onShowSignUp={handleShowSignUp}
        />
        
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/jobs" element={<JobsPage />} />
          {isAuthenticated && userType === 'candidate' && (
            <>
              <Route path="/dashboard" element={<CandidateDashboard />} />
              <Route path="/applications" element={<div>My Applications Page</div>} />
            </>
          )}
          {isAuthenticated && userType === 'recruiter' && (
            <>
              <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
              <Route path="/post-job" element={<div>Post Job Page</div>} />
              <Route path="/candidates" element={<div>Candidates Page</div>} />
            </>
          )}
        </Routes>

        {/* Authentication Modals */}
        {showSignUp && (
          <SignUpForm
            userType={signUpType}
            onClose={handleCloseModals}
            onSwitchToSignIn={handleSwitchToSignIn}
          />
        )}

        {showSignIn && (
          <SignInForm
            onClose={handleCloseModals}
            onSwitchToSignUp={handleSwitchToSignUp}
            onSignInSuccess={handleSignInSuccess}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
