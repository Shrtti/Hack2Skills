"use client";
import React, { useState, useEffect, useRef } from 'react';
import WelcomeScreen from '../../components/WelcomeScreen';
import OnboardingQuestions from '../../components/OnboardingQuestions';
import ChatInterface from '../../components/ChatInterface';
import CrisisMode from '../../components/CrisisMode';
import FloatingParticles from '../../components/FloatingParticles';
import { themes, onboardingQuestions, badges } from '../../components/constants';

// Main app component
export default function Home() {
  const [step, setStep] = useState('welcome'); // welcome, onboarding, chat, crisis
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [mood, setMood] = useState('happy');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [isCrisis, setIsCrisis] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [newBadge, setNewBadge] = useState(null);
  
  const messagesEndRef = useRef(null);
  const chatSectionRef = useRef(null);
  const theme = themes[isCrisis ? 'crisis' : mood];

  // Handle onboarding answer
  const handleAnswer = (answer) => {
    const updatedAnswers = { ...answers, [onboardingQuestions[currentQuestion].id]: answer };
    setAnswers(updatedAnswers);
    
    if (onboardingQuestions[currentQuestion].type === 'mood') {
      setMood(answer);
    }
    
    if (currentQuestion < onboardingQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Onboarding complete
      setStep('chat');
      setMessages([{
        type: 'ai',
        content: `Hi there! I'm here to support you through whatever you're feeling. Based on what you've shared, I can see you're feeling ${mood}. How can I help you today?`,
        timestamp: new Date()
      }]);
    }
  };

  // Handle Get Started button click with smooth scroll
  const handleGetStarted = () => {
    setStep('onboarding');
    // Small delay to ensure the onboarding section is rendered
    setTimeout(() => {
      if (chatSectionRef.current) {
        chatSectionRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  // Handle sending message
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    setIsListening(true);
    const newMessage = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    
    // Crisis detection simulation
    const crisisKeywords = ['hurt myself', 'end it all', 'suicide', 'kill myself', 'want to die'];
    const isCrisisMessage = crisisKeywords.some(keyword => 
      inputMessage.toLowerCase().includes(keyword)
    );
    
    setTimeout(() => {
      setIsListening(false);
      
      if (isCrisisMessage) {
        setIsCrisis(true);
        setStep('crisis');
        return;
      }
      
      setIsResponding(true);
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          type: 'ai',
          content: "I hear you, and I want you to know that your feelings are valid. It takes courage to share what's on your mind. Can you tell me more about what's been challenging for you lately?",
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiResponse]);
        setIsResponding(false);
        
        // Random badge earning
        if (Math.random() > 0.7 && earnedBadges.length < badges.length) {
          const availableBadges = badges.filter(badge => !earnedBadges.includes(badge.id));
          if (availableBadges.length > 0) {
            const randomBadge = availableBadges[Math.floor(Math.random() * availableBadges.length)];
            setNewBadge(randomBadge);
            setEarnedBadges(prev => [...prev, randomBadge.id]);
            setShowBadgeModal(true);
          }
        }
      }, 2000);
    }, 1000);
  };

  if (step === 'crisis') {
    return <CrisisMode />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.background} transition-all duration-1000`}>
      <FloatingParticles theme={theme} />
      
      <div className="relative z-10 w-full h-full">
        {step === 'welcome' && (
          <WelcomeScreen onGetStarted={handleGetStarted} />
        )}

        {step === 'onboarding' && (
          <div ref={chatSectionRef}>
             <OnboardingQuestions
               currentQuestion={currentQuestion}
               mood={mood}
               theme={theme}
               onAnswer={handleAnswer}
               onBack={() => setStep('welcome')}
               inputMessage={inputMessage}
               setInputMessage={setInputMessage}
             />
          </div>
        )}
        
        {step === 'chat' && (
          <ChatInterface
                  mood={mood} 
            theme={theme}
            messages={messages}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
                  isListening={isListening} 
                  isResponding={isResponding}
                  isCrisis={isCrisis}
            earnedBadges={earnedBadges}
            onSendMessage={handleSendMessage}
            showBadgeModal={showBadgeModal}
            setShowBadgeModal={setShowBadgeModal}
            newBadge={newBadge}
          />
        )}
      </div>
      
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .fixed .absolute {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
}