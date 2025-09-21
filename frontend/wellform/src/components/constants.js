// Mood-based themes
export const themes = {
  happy: {
    primary: 'from-yellow-400 to-orange-400',
    secondary: 'from-pink-300 to-rose-400',
    background: 'from-yellow-50 to-orange-50',
    text: 'text-orange-800',
    accent: 'bg-yellow-400',
    particles: 'bg-yellow-300'
  },
  stressed: {
    primary: 'from-blue-400 to-indigo-500',
    secondary: 'from-purple-300 to-blue-400',
    background: 'from-blue-50 to-indigo-50',
    text: 'text-indigo-800',
    accent: 'bg-blue-400',
    particles: 'bg-blue-300'
  },
  anxious: {
    primary: 'from-purple-400 to-indigo-400',
    secondary: 'from-lavender-300 to-purple-300',
    background: 'from-purple-50 to-indigo-50',
    text: 'text-purple-800',
    accent: 'bg-purple-400',
    particles: 'bg-purple-300'
  },
  tired: {
    primary: 'from-green-400 to-emerald-500',
    secondary: 'from-teal-300 to-green-400',
    background: 'from-green-50 to-emerald-50',
    text: 'text-green-800',
    accent: 'bg-green-400',
    particles: 'bg-green-300'
  },
  crisis: {
    primary: 'from-slate-300 to-slate-400',
    secondary: 'from-slate-200 to-slate-300',
    background: 'from-slate-50 to-gray-50',
    text: 'text-slate-700',
    accent: 'bg-slate-300',
    particles: 'bg-slate-200'
  }
};

// Onboarding questions
export const onboardingQuestions = [
  {
    id: 1,
    question: "How are you feeling right now?",
    type: "mood",
    options: [
      { value: "happy", label: "Happy & Energetic" },
      { value: "stressed", label: "Stressed & Overwhelmed" },
      { value: "anxious", label: "Anxious & Worried" },
      { value: "tired", label: "Tired & Low Energy" }
    ]
  },
  {
    id: 2,
    question: "What would you like to work on today?",
    type: "goal",
    options: [
      { value: "Managing stress", label: "Managing stress" },
      { value: "Building confidence", label: "Building confidence" },
      { value: "Better sleep", label: "Better sleep" },
      { value: "Emotional regulation", label: "Emotional regulation" },
      { value: "Social anxiety", label: "Social anxiety" },
      { value: "Just need someone to talk to", label: "Just need someone to talk to" }
    ]
  },
  {
    id: 3,
    question: "What kind of support are you looking for today?",
    type: "multiple",
    options: [
      { value: "chat", label: "Someone to talk to", emoji: "💬" },
      { value: "guidance", label: "Guidance & advice", emoji: "🧭" },
      { value: "coping", label: "Coping strategies", emoji: "🛡️" },
      { value: "reflection", label: "Self-reflection", emoji: "🪞" }
    ]
  },
  {
    id: 4,
    question: "On a scale of 1-10, how comfortable are you sharing personal thoughts?",
    type: "scale",
    min: 1,
    max: 10
  }
];

// Reflection badges
export const badges = [
  { id: 'resilience', name: 'Resilience Builder', icon: 'Shield', color: 'text-blue-600' },
  { id: 'calm', name: 'Calm Achiever', icon: 'Heart', color: 'text-green-600' },
  { id: 'insight', name: 'Self Insight', icon: 'Brain', color: 'text-purple-600' },
  { id: 'courage', name: 'Courage', icon: 'Zap', color: 'text-orange-600' },
  { id: 'growth', name: 'Personal Growth', icon: 'Star', color: 'text-yellow-600' }
];
