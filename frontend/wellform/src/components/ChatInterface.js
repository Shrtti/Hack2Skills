"use client";
import React from 'react';
import { Send, Award, Shield, Heart, Brain, Zap, Star } from 'lucide-react';
import Avatar from './Avatar';
import { themes, badges } from './constants';

const ChatInterface = ({
  mood,
  theme,
  messages,
  inputMessage,
  setInputMessage,
  isListening,
  isResponding,
  isCrisis,
  earnedBadges,
  onSendMessage,
  showBadgeModal,
  setShowBadgeModal,
  newBadge
}) => {
  const messagesEndRef = React.useRef(null);

  // Auto-scroll messages
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      <div className="min-h-screen flex">
        {/* Left sidebar */}
        <div className="w-80 bg-white bg-opacity-90 backdrop-blur-sm p-6 flex flex-col">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">WellForm</h2>
            <p className="text-gray-600">Your wellness companion</p>
          </div>

          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <Avatar 
              mood={mood} 
              isListening={isListening} 
              isResponding={isResponding}
              isCrisis={isCrisis}
            />
          </div>

          {/* User info */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <div className="text-sm text-gray-600 mb-2">Current mood</div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${theme.accent}`}></div>
              <span className="font-medium text-gray-800 capitalize">{mood}</span>
            </div>
          </div>

          {/* Badges */}
          {earnedBadges.length > 0 && (
            <div className="mb-6">
              <div className="text-sm font-medium text-gray-600 mb-3">Your achievements</div>
              <div className="space-y-2">
                {earnedBadges.map((badgeId) => {
                  const badge = badges.find(b => b.id === badgeId);
                  const iconMap = { Shield, Heart, Brain, Zap, Star };
                  const IconComponent = iconMap[badge.icon];
                  return (
                    <div key={badgeId} className="flex items-center space-x-3 bg-white rounded-xl p-3">
                      <IconComponent className={`w-5 h-5 ${badge.color}`} />
                      <span className="text-sm font-medium text-gray-700">{badge.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Support info */}
          <div className="mt-auto">
            <div className="bg-blue-50 rounded-2xl p-4">
              <div className="text-sm font-medium text-blue-800 mb-2">Need immediate help?</div>
              <button className="text-blue-600 text-sm hover:text-blue-800 transition-colors">
                Crisis support →
              </button>
            </div>
          </div>
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col">
          {/* Chat messages */}
          <div className="flex-1 bg-white bg-opacity-60 backdrop-blur-sm p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-lg px-6 py-4 rounded-3xl ${
                      message.type === 'user'
                        ? `bg-gradient-to-r ${theme.primary} text-white`
                        : 'bg-white shadow-md text-gray-800'
                    }`}
                  >
                    <p className="text-lg leading-relaxed">{message.content}</p>
                    <p className="text-sm opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Message input */}
          <div className="bg-white bg-opacity-90 backdrop-blur-sm p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
                  placeholder="Share your thoughts..."
                  className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-3xl focus:border-blue-400 focus:outline-none text-lg text-gray-800 placeholder-gray-500"
                  disabled={isListening || isResponding}
                />
                <button
                  onClick={onSendMessage}
                  disabled={isListening || isResponding || !inputMessage.trim()}
                  className={`px-8 py-4 bg-gradient-to-r ${theme.primary} text-white rounded-3xl hover:opacity-90 transition-opacity disabled:opacity-50`}
                >
                  <Send className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Badge Achievement Modal */}
      {showBadgeModal && newBadge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm mx-4 text-center animate-bounce">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Badge Earned!</h3>
            <div className="flex items-center justify-center space-x-2 mb-4">
              {(() => {
                const iconMap = { Shield, Heart, Brain, Zap, Star };
                const IconComponent = iconMap[newBadge.icon];
                return <IconComponent className={`w-6 h-6 ${newBadge.color}`} />;
              })()}
              <span className="font-semibold text-gray-700">{newBadge.name}</span>
            </div>
            <p className="text-gray-600 text-sm mb-6">
              You're making great progress on your wellness journey!
            </p>
            <button
              onClick={() => setShowBadgeModal(false)}
              className={`px-6 py-2 bg-gradient-to-r ${theme.primary} text-white rounded-xl hover:opacity-90 transition-opacity`}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatInterface;
