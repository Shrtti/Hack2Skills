"use client";
import React from 'react';
import { MessageCircle, Phone, Heart } from 'lucide-react';

const CrisisMode = () => {
  return (
    <div className="fixed inset-0 bg-slate-50 bg-opacity-95 z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md mx-4 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">We're Here for You</h2>
        <p className="text-slate-600 mb-8">It sounds like you're going through a difficult time. You don't have to face this alone.</p>
        
        <div className="space-y-4">
          <button
            onClick={() => window.open("https://icallhelpline.org/", "_blank")}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-3 transition-colors"
          >
            <Phone className="w-5 h-5" />
            <span>Call Crisis Helpline</span>
          </button>
          <button
              onClick={() => window.open("https://icallhelpline.org/", "_blank")}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-3 transition-colors"
          >
              <MessageCircle className="w-5 h-5" />
              <span>Text Support</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrisisMode;
