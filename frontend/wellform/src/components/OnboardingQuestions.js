"use client";
import React, { useState, useEffect } from 'react';
import Avatar from './Avatar';
import { themes, onboardingQuestions } from './constants';

const OnboardingQuestions = ({ 
  currentQuestion, 
  mood, 
  theme, 
  onAnswer, 
  onBack,  
  inputMessage,
  setInputMessage 
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Reset selected answer when question changes
  useEffect(() => {
    setSelectedAnswer(null);
  }, [currentQuestion]);

  // Handle next question
  const handleNext = () => {
    if (selectedAnswer !== null) {
      onAnswer(selectedAnswer);
      setSelectedAnswer(null); // Reset selection for next question
    }
  };

  // Handle answer selection (without auto-submitting)
  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer);
  };

  return (
    <div className="min-h-screen flex flex-col px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Getting to know you</h1>
          <p className="text-gray-600">Help us personalize your experience</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <div 
          className={`h-2 rounded-full bg-gradient-to-r ${theme.primary} transition-all duration-500`}
          style={{ width: `${((currentQuestion + 1) / onboardingQuestions.length) * 100}%` }}
        ></div>
      </div>

      <div className="flex-1 flex">
        {/* Left side - Avatar */}
        <div className="w-1/3 flex flex-col items-center justify-center">
          <Avatar mood={mood} />
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">
              Question {currentQuestion + 1} of {onboardingQuestions.length}
            </p>
            <div className="flex justify-center space-x-2">
              {onboardingQuestions.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index <= currentQuestion ? theme.accent : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Question content */}
        <div className="w-2/3 pl-12">
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
            <h2 className="text-3xl font-semibold text-gray-800 mb-8">
              {onboardingQuestions[currentQuestion].question}
            </h2>

            <div className="space-y-6">
              {onboardingQuestions[currentQuestion].type === 'mood' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    {onboardingQuestions[currentQuestion].options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleAnswerSelection(option.value)}
                        className={`p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 ${
                          selectedAnswer === option.value 
                            ? `border-blue-400 bg-blue-50` 
                            : 'border-transparent hover:border-gray-200 bg-white'
                        }`}
                      >
                        <div className="text-4xl mb-4">{option.emoji}</div>
                        <div className="font-semibold text-gray-800 text-lg">{option.label}</div>
                      </button>
                    ))}
                  </div>
                  {selectedAnswer && (
                    <button
                      onClick={handleNext}
                      className={`w-full py-4 px-8 bg-gradient-to-r ${theme.primary} text-white rounded-3xl font-semibold text-lg hover:opacity-90 transition-opacity`}
                    >
                      Next Question
                    </button>
                  )}
                </div>
              )}
              
              {onboardingQuestions[currentQuestion].type === 'goal' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    {onboardingQuestions[currentQuestion].options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleAnswerSelection(option.value)}
                        className={`p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 ${
                          selectedAnswer === option.value 
                            ? `border-blue-400 bg-blue-50` 
                            : 'border-transparent hover:border-gray-200 bg-white'
                        }`}
                      >
                        <div className="font-semibold text-gray-800 text-lg">{option.label}</div>
                      </button>
                    ))}
                  </div>
                  {selectedAnswer && (
                    <button
                      onClick={handleNext}
                      className={`w-full py-4 px-8 bg-gradient-to-r ${theme.primary} text-white rounded-3xl font-semibold text-lg hover:opacity-90 transition-opacity`}
                    >
                      Next Question
                    </button>
                  )}
                </div>
              )}
              
              {onboardingQuestions[currentQuestion].type === 'multiple' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    {onboardingQuestions[currentQuestion].options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleAnswerSelection(option.value)}
                        className={`p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 ${
                          selectedAnswer === option.value 
                            ? `border-blue-400 bg-blue-50` 
                            : 'border-transparent hover:border-gray-200 bg-white'
                        }`}
                      >
                        <div className="text-3xl mb-4">{option.emoji}</div>
                        <div className="font-semibold text-gray-800 text-lg">{option.label}</div>
                      </button>
                    ))}
                  </div>
                  {selectedAnswer && (
                    <button
                      onClick={handleNext}
                      className={`w-full py-4 px-8 bg-gradient-to-r ${theme.primary} text-white rounded-3xl font-semibold text-lg hover:opacity-90 transition-opacity`}
                    >
                      Next Question
                    </button>
                  )}
                </div>
              )}
              
              {onboardingQuestions[currentQuestion].type === 'scale' && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Not comfortable</span>
                    <span className="text-gray-500">Very comfortable</span>
                  </div>
                  <div className="flex justify-center space-x-3">
                    {Array.from({ length: 10 }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handleAnswerSelection(i + 1)}
                        className={`w-14 h-14 rounded-full font-bold text-lg transition-all hover:scale-110 border-2 ${
                          selectedAnswer === i + 1
                            ? 'border-blue-400 bg-blue-100 text-blue-600'
                            : i + 1 <= 5 
                              ? 'bg-red-100 hover:bg-red-200 text-red-600 border-transparent' 
                              : 'bg-green-100 hover:bg-green-200 text-green-600 border-transparent'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  {selectedAnswer && (
                    <button
                      onClick={handleNext}
                      className={`w-full py-4 px-8 bg-gradient-to-r ${theme.primary} text-white rounded-3xl font-semibold text-lg hover:opacity-90 transition-opacity`}
                    >
                      Next Question
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingQuestions;
