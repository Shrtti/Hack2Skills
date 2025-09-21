import { useState, useEffect } from 'react';

const FloatingParticles = ({ count = 20, theme }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate particles only on client side to avoid hydration mismatch
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 4 + 3, // 3-7 seconds
      delay: Math.random() * 2 // 0-2 seconds delay
    }));
    setParticles(newParticles);
  }, [count]);

  if (particles.length === 0) {
    return <div className="fixed inset-0 pointer-events-none overflow-hidden" />;
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute w-2 h-2 ${theme.particles} rounded-full opacity-30`}
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`
          }}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;