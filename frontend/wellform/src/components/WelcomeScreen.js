"use client";
import React from 'react';
import { Shield, Brain, Star, Smile } from 'lucide-react';

const WelcomeScreen = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <div className="pt-8 pb-4 px-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3">
              <img src="/favicon.png" alt="WellForm" className="w-9 h-9" />
              <h1 className="text-3xl font-bold text-gray-800">WellForm</h1>
            </div>
            <p className="text-gray-600">Your safe space for mental wellness</p>
          </div>
        </div>
      </div>

      {/* Main welcome content */}
      <div className="flex-1 flex items-center justify-between px-8">
        <div className="w-1/2 space-y-8">
          <div className="space-y-6">
            <h2 className="text-5xl font-bold text-gray-900 leading-tight">
              Your journey to 
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"> wellness</span> 
              <br />starts here
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              A safe, supportive space designed specifically for young minds. 
              Get personalized support, build resilience, and discover coping strategies 
              that work for you.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-gray-700">Safe & Confidential</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Brain className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-gray-700">AI-Powered Support</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-gray-700">Personalized Experience</span>
            </div>
          </div>

          <button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Get Started
          </button>
        </div>

        {/* Welcome illustration area */}
        <div className="w-1/2 flex justify-center">
          <div className="relative">
            {/* Large background circle */}
            <div className="w-80 h-80 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-60"></div>
            
            {/* Medium circle */}
            <div className="absolute top-12 left-12 w-56 h-56 bg-gradient-to-br from-green-200 to-blue-200 rounded-full opacity-70"></div>
            
            {/* Small accent circles */}
            <div className="absolute top-20 right-16 w-20 h-20 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full opacity-80"></div>
            <div className="absolute bottom-16 left-8 w-16 h-16 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full opacity-80"></div>
            
            {/* Center avatar-like element */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                <div className="w-20 h-20 bg-gradient-to-br from-white to-indigo-100 rounded-full flex items-center justify-center">
                  <Smile className="w-10 h-10 text-indigo-500" />
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute top-8 left-20 w-6 h-6 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="absolute top-32 right-8 w-4 h-4 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-24 right-24 w-8 h-8 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pb-8 px-8">
        <div className="text-center text-gray-500 text-sm">
          <p>Available 24/7 • Crisis support available • Your privacy matters</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
