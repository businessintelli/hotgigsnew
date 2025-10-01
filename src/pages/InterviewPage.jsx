import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Briefcase,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

const InterviewPage = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  
  // Interview state
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState('intro'); // intro, technical, general, situational, conclusion, complete
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({
    intro: '',
    technical: [],
    general: [],
    situational: [],
    conclusion: ''
  });
  
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentResponse, setCurrentResponse] = useState('');
  const [retakeCount, setRetakeCount] = useState(0);
  const [maxRetakes] = useState(3);
  
  // Media state
  const [stream, setStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  // Refs
  const videoRef = useRef(null);
  const timerRef = useRef(null);
  const recordedChunks = useRef([]);

  useEffect(() => {
    fetchInterview();
    setupMedia();
    
    return () => {
      cleanup();
    };
  }, [interviewId]);

  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    
    return () => clearInterval(timerRef.current);
  }, [isRecording, isPaused]);

  const fetchInterview = async () => {
    try {
      const response = await axios.get(`/api/v1/interviews/${interviewId}`);
      setInterview(response.data);
      
      // Initialize responses arrays based on questions
      const questions = response.data.questions;
      setResponses(prev => ({
        ...prev,
        technical: new Array(questions.technical?.length || 0).fill(''),
        general: new Array(questions.general?.length || 0).fill(''),
        situational: new Array(questions.situational?.length || 0).fill('')
      }));
      
    } catch (error) {
      console.error('Failed to fetch interview:', error);
      setError('Interview not found or expired');
    } finally {
      setLoading(false);
    }
  };

  const setupMedia = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
    } catch (error) {
      console.error('Failed to access media devices:', error);
      setError('Camera and microphone access is required for the interview');
    }
  };

  const cleanup = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    clearInterval(timerRef.current);
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const startRecording = () => {
    if (!stream) return;
    
    recordedChunks.current = [];
    const recorder = new MediaRecorder(stream);
    
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.current.push(event.data);
      }
    };
    
    recorder.onstop = () => {
      // Here you would typically upload the video blob
      // For demo purposes, we'll just save the text response
      console.log('Recording stopped, chunks:', recordedChunks.current.length);
    };
    
    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);
    setRecordingTime(0);
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setMediaRecorder(null);
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorder && isRecording) {
      if (isPaused) {
        mediaRecorder.resume();
        setIsPaused(false);
      } else {
        mediaRecorder.pause();
        setIsPaused(true);
      }
    }
  };

  const saveResponse = () => {
    if (!currentResponse.trim()) {
      setError('Please provide a response before continuing');
      return;
    }
    
    const newResponses = { ...responses };
    
    if (currentStep === 'intro' || currentStep === 'conclusion') {
      newResponses[currentStep] = currentResponse;
    } else {
      newResponses[currentStep][currentQuestionIndex] = currentResponse;
    }
    
    setResponses(newResponses);
    setCurrentResponse('');
    setRecordingTime(0);
    
    // Move to next question or step
    nextQuestion();
  };

  const retakeResponse = () => {
    if (retakeCount >= maxRetakes) {
      setError(`Maximum retakes (${maxRetakes}) reached for this question`);
      return;
    }
    
    setCurrentResponse('');
    setRecordingTime(0);
    setRetakeCount(prev => prev + 1);
    stopRecording();
  };

  const nextQuestion = () => {
    const questions = interview.questions;
    
    if (currentStep === 'intro') {
      setCurrentStep('technical');
      setCurrentQuestionIndex(0);
    } else if (currentStep === 'technical') {
      if (currentQuestionIndex < questions.technical.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setCurrentStep('general');
        setCurrentQuestionIndex(0);
      }
    } else if (currentStep === 'general') {
      if (currentQuestionIndex < questions.general.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setCurrentStep('situational');
        setCurrentQuestionIndex(0);
      }
    } else if (currentStep === 'situational') {
      if (currentQuestionIndex < questions.situational.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setCurrentStep('conclusion');
        setCurrentQuestionIndex(0);
      }
    } else if (currentStep === 'conclusion') {
      submitInterview();
    }
    
    setRetakeCount(0);
  };

  const previousQuestion = () => {
    if (currentStep === 'technical' && currentQuestionIndex === 0) {
      setCurrentStep('intro');
    } else if (currentStep === 'general' && currentQuestionIndex === 0) {
      setCurrentStep('technical');
      setCurrentQuestionIndex(interview.questions.technical.length - 1);
    } else if (currentStep === 'situational' && currentQuestionIndex === 0) {
      setCurrentStep('general');
      setCurrentQuestionIndex(interview.questions.general.length - 1);
    } else if (currentStep === 'conclusion') {
      setCurrentStep('situational');
      setCurrentQuestionIndex(interview.questions.situational.length - 1);
    } else {
      setCurrentQuestionIndex(prev => prev - 1);
    }
    
    setRetakeCount(0);
  };

  const submitInterview = async () => {
    try {
      setLoading(true);
      
      // Prepare all responses
      const allResponses = [
        responses.intro,
        ...responses.technical,
        ...responses.general,
        ...responses.situational,
        responses.conclusion
      ].filter(response => response.trim());
      
      await axios.post(`/api/v1/interviews/${interviewId}/submit`, {
        responses: allResponses
      });
      
      setCurrentStep('complete');
      
    } catch (error) {
      console.error('Failed to submit interview:', error);
      setError('Failed to submit interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentQuestion = () => {
    if (!interview) return null;
    
    const questions = interview.questions;
    
    if (currentStep === 'intro') {
      return questions.intro;
    } else if (currentStep === 'conclusion') {
      return questions.conclusion;
    } else if (questions[currentStep]) {
      return questions[currentStep][currentQuestionIndex];
    }
    
    return null;
  };

  const getProgress = () => {
    if (!interview) return 0;
    
    const questions = interview.questions;
    const totalQuestions = 2 + // intro + conclusion
      questions.technical.length +
      questions.general.length +
      questions.situational.length;
    
    let completed = 0;
    
    if (responses.intro) completed++;
    completed += responses.technical.filter(r => r.trim()).length;
    completed += responses.general.filter(r => r.trim()).length;
    completed += responses.situational.filter(r => r.trim()).length;
    if (responses.conclusion) completed++;
    
    return Math.round((completed / totalQuestions) * 100);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !interview) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Interview Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
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

  if (currentStep === 'complete') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center max-w-md mx-auto p-8">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Interview Complete!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for completing your AI-powered interview. Your responses have been submitted and will be reviewed by our AI system.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            You will receive feedback and next steps via email within 24-48 hours.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = getCurrentQuestion();
  const progress = getProgress();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">HG</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold">AI Interview</h1>
              <p className="text-sm text-gray-400">
                {currentStep.charAt(0).toUpperCase() + currentStep.slice(1)} Questions
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Progress</p>
              <p className="font-semibold">{progress}%</p>
            </div>
            <div className="w-20 h-2 bg-gray-700 rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Video Section */}
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="aspect-video bg-gray-900 rounded-lg mb-4 relative overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
                {!videoEnabled && (
                  <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                    <VideoOff className="w-12 h-12 text-gray-500" />
                  </div>
                )}
              </div>
              
              {/* Media Controls */}
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={toggleVideo}
                  className={`p-3 rounded-full ${videoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'} transition-colors`}
                >
                  {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={toggleAudio}
                  className={`p-3 rounded-full ${audioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'} transition-colors`}
                >
                  {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Recording Controls */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-lg font-mono">{formatTime(recordingTime)}</span>
                  {isRecording && (
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  )}
                </div>
                
                <div className="text-sm text-gray-400">
                  Retakes: {retakeCount}/{maxRetakes}
                </div>
              </div>
              
              <div className="flex space-x-3">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Video className="w-5 h-5" />
                    <span>Start Recording</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={pauseRecording}
                      className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                    >
                      {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                      <span>{isPaused ? 'Resume' : 'Pause'}</span>
                    </button>
                    
                    <button
                      onClick={stopRecording}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Stop</span>
                    </button>
                  </>
                )}
                
                {retakeCount < maxRetakes && (
                  <button
                    onClick={retakeResponse}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>Retake</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Question Section */}
          <div className="space-y-6">
            {/* Current Question */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="font-bold">
                    {currentStep === 'intro' ? '👋' : 
                     currentStep === 'technical' ? '💻' :
                     currentStep === 'general' ? '👥' :
                     currentStep === 'situational' ? '🎯' : '✨'}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold capitalize">{currentStep} Question</h3>
                  <p className="text-sm text-gray-400">
                    {currentStep === 'intro' || currentStep === 'conclusion' ? 
                      `Time limit: ${Math.floor(currentQuestion?.timeLimit / 60)} minutes` :
                      `Question ${currentQuestionIndex + 1} of ${interview.questions[currentStep]?.length || 0}`
                    }
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-4 mb-4">
                <p className="text-lg leading-relaxed">{currentQuestion?.question}</p>
              </div>
              
              {currentQuestion?.timeLimit && (
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Recommended time: {Math.floor(currentQuestion.timeLimit / 60)} minutes</span>
                </div>
              )}
            </div>

            {/* Response Input */}
            <div className="bg-gray-800 rounded-lg p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your Response (Optional - for reference)
              </label>
              <textarea
                value={currentResponse}
                onChange={(e) => setCurrentResponse(e.target.value)}
                rows={6}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="You can type notes here while recording your video response..."
              />
            </div>

            {error && (
              <div className="bg-red-900 border border-red-700 rounded-lg p-4 flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span className="text-red-200 text-sm">{error}</span>
              </div>
            )}

            {/* Navigation */}
            <div className="flex space-x-4">
              <button
                onClick={previousQuestion}
                disabled={currentStep === 'intro'}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              
              <button
                onClick={saveResponse}
                disabled={!currentResponse.trim() && !isRecording}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                <span>
                  {currentStep === 'conclusion' ? 'Submit Interview' : 'Next Question'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
