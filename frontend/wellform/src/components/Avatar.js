"use client";
import React from 'react';
import { themes } from './constants';

const Avatar = ({ mood, isListening, isResponding, isCrisis }) => {
  const theme = themes[isCrisis ? 'crisis' : mood] || themes.happy;
  
  return (
    <div className="flex justify-center mb-8">
      <div className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${theme.primary} flex items-center justify-center transition-all duration-500 ${
        isListening ? 'scale-110' : isResponding ? 'scale-105 animate-pulse' : 'scale-100'
      }`}>
        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${theme.secondary} flex items-center justify-center`}>
          <div className={`w-8 h-8 rounded-full ${theme.accent} ${isResponding ? 'animate-ping' : ''}`} />
        </div>
        {isListening && (
          <div className="absolute inset-0 rounded-full border-2 border-white opacity-50 animate-ping" />
        )}
      </div>
    </div>
  );
};

export default Avatar;
