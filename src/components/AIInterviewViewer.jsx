import React, { useState, useEffect } from 'react';

const AIInterviewViewer = ({ candidate, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(180); // 3 minutes total

  // Mock interview data for Mike Chen
  const interviewData = {
    candidate: {
      name: 'Mike Chen',
      position: 'Data Scientist',
      interviewDate: '2024-10-01',
      duration: '15:32',
      overallScore: 78
    },
    questions: [
      {
        id: 1,
        question: "Tell me about your experience with machine learning algorithms.",
        answer: "I have 4+ years of experience working with various ML algorithms including supervised learning methods like Random Forest, SVM, and neural networks. In my previous role at DataTech, I implemented predictive models that improved customer retention by 23%.",
        aiScore: 85,
        aiAnalysis: "Strong technical knowledge demonstrated. Specific examples provided with quantifiable results.",
        timestamp: "00:30",
        duration: "2:15"
      },
      {
        id: 2,
        question: "How do you handle missing data in your datasets?",
        answer: "I typically start by analyzing the pattern of missing data - whether it's MCAR, MAR, or MNAR. For numerical data, I might use mean/median imputation or more sophisticated methods like KNN imputation. For categorical data, I often use mode imputation or create a separate 'missing' category.",
        aiScore: 92,
        aiAnalysis: "Excellent understanding of missing data mechanisms. Demonstrates knowledge of multiple imputation strategies.",
        timestamp: "03:45",
        duration: "1:50"
      },
      {
        id: 3,
        question: "Describe a challenging data science project you've worked on.",
        answer: "I worked on a customer churn prediction model where we had highly imbalanced data - only 5% churn rate. I used SMOTE for oversampling, implemented ensemble methods, and focused on precision-recall metrics rather than accuracy. The final model achieved 0.78 F1-score.",
        aiScore: 88,
        aiAnalysis: "Good problem-solving approach. Shows understanding of imbalanced data challenges and appropriate evaluation metrics.",
        timestamp: "06:30",
        duration: "2:45"
      },
      {
        id: 4,
        question: "How do you ensure your models are interpretable and explainable?",
        answer: "I use techniques like SHAP values for feature importance, LIME for local explanations, and always create visualizations to help stakeholders understand model decisions. I also document my feature engineering process and model assumptions clearly.",
        aiScore: 75,
        aiAnalysis: "Demonstrates awareness of model interpretability. Could have mentioned more about business stakeholder communication.",
        timestamp: "09:15",
        duration: "2:10"
      },
      {
        id: 5,
        question: "What interests you most about this Data Scientist position?",
        answer: "I'm excited about the opportunity to work with large-scale data and implement ML solutions that directly impact business decisions. The company's focus on innovation and the collaborative team environment really appeals to me.",
        aiScore: 70,
        aiAnalysis: "Shows enthusiasm but could be more specific about the role and company. Answer feels somewhat generic.",
        timestamp: "12:25",
        duration: "1:35"
      }
    ],
    aiSummary: {
      strengths: [
        "Strong technical knowledge in machine learning",
        "Good understanding of data preprocessing techniques",
        "Experience with real-world ML projects",
        "Awareness of model evaluation metrics"
      ],
      improvements: [
        "Could improve communication of business impact",
        "More specific examples of stakeholder interaction",
        "Deeper discussion of model deployment experience"
      ],
      recommendation: "PROCEED TO NEXT ROUND",
      confidence: 78
    }
  };

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 85) return 'bg-green-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">🎥 AI Interview Analysis</h2>
              <div className="flex items-center space-x-4 text-purple-100">
                <span>{interviewData.candidate.name}</span>
                <span>•</span>
                <span>{interviewData.candidate.position}</span>
                <span>•</span>
                <span>Duration: {interviewData.candidate.duration}</span>
                <span>•</span>
                <span>Date: {interviewData.candidate.interviewDate}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
          
          {/* Overall Score */}
          <div className="mt-4 flex items-center space-x-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-sm text-purple-100">Overall AI Score</div>
              <div className="text-3xl font-bold">{interviewData.candidate.overallScore}%</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-sm text-purple-100">Recommendation</div>
              <div className="text-lg font-semibold text-green-200">PROCEED TO NEXT ROUND</div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Player Section */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                {/* Mock Video Player */}
                <div className="aspect-video bg-gray-800 flex items-center justify-center relative">
                  <div className="text-center text-white">
                    <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">👨‍💻</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Mike Chen</h3>
                    <p className="text-gray-300">Data Scientist Interview</p>
                  </div>
                  
                  {/* Play Button Overlay */}
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all"
                  >
                    <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                      {isPlaying ? (
                        <span className="text-2xl">⏸️</span>
                      ) : (
                        <span className="text-2xl ml-1">▶️</span>
                      )}
                    </div>
                  </button>
                </div>
                
                {/* Video Controls */}
                <div className="bg-gray-800 p-4">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="text-white hover:text-blue-400"
                    >
                      {isPlaying ? '⏸️' : '▶️'}
                    </button>
                    <div className="flex-1">
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${(currentTime / duration) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Questions Timeline */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">📝 Interview Questions</h3>
                <div className="space-y-3">
                  {interviewData.questions.map((q, index) => (
                    <div
                      key={q.id}
                      onClick={() => setCurrentQuestion(index)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        currentQuestion === index
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                              Q{q.id}
                            </span>
                            <span className="text-sm text-gray-500">{q.timestamp}</span>
                            <span className="text-sm text-gray-500">({q.duration})</span>
                          </div>
                          <p className="font-medium text-gray-800">{q.question}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreBg(q.aiScore)} ${getScoreColor(q.aiScore)}`}>
                          {q.aiScore}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Analysis Panel */}
            <div className="space-y-6">
              {/* Current Question Analysis */}
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold mb-3">🤖 AI Analysis</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Question {currentQuestion + 1}</div>
                    <p className="text-sm font-medium">{interviewData.questions[currentQuestion].question}</p>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Candidate Answer</div>
                    <p className="text-sm bg-gray-50 p-3 rounded">{interviewData.questions[currentQuestion].answer}</p>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600 mb-1">AI Score</div>
                    <div className={`text-2xl font-bold ${getScoreColor(interviewData.questions[currentQuestion].aiScore)}`}>
                      {interviewData.questions[currentQuestion].aiScore}%
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600 mb-1">AI Analysis</div>
                    <p className="text-sm">{interviewData.questions[currentQuestion].aiAnalysis}</p>
                  </div>
                </div>
              </div>

              {/* Overall Summary */}
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold mb-3">📊 Interview Summary</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-green-700 mb-2">✅ Strengths</h4>
                    <ul className="text-sm space-y-1">
                      {interviewData.aiSummary.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-orange-700 mb-2">🔄 Areas for Improvement</h4>
                    <ul className="text-sm space-y-1">
                      {interviewData.aiSummary.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-orange-500 mr-2">•</span>
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="text-sm text-gray-600 mb-1">Final Recommendation</div>
                    <div className="font-semibold text-green-600">{interviewData.aiSummary.recommendation}</div>
                    <div className="text-sm text-gray-500">Confidence: {interviewData.aiSummary.confidence}%</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                  ✅ Approve for Next Round
                </button>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  📧 Schedule Live Interview
                </button>
                <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                  📄 Download Full Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInterviewViewer;
