import React, { useState } from 'react';

interface GachaMachineProps {
  onSpin: () => void;
  isSpinning: boolean;
  disabled: boolean;
}

export const GachaMachine: React.FC<GachaMachineProps> = ({ onSpin, isSpinning, disabled }) => {
  const [handleRotation, setHandleRotation] = useState(0);

  const handleClick = () => {
    if (disabled || isSpinning) return;
    setHandleRotation(prev => prev + 360);
    onSpin();
  };

  // Helper to render a two-tone capsule
  const renderCapsule = (colorClass: string, bottom: string, left: string | undefined, right: string | undefined, rotate: string, delay: string, zIndex: number = 0) => (
    <div className={`
      absolute w-16 h-16 rounded-full border-[3px] border-black shadow-sm overflow-hidden
      transform transition-all duration-300 ${delay}
      ${isSpinning ? 'translate-y-[-20px] rotate-[180deg]' : rotate}
    `}
    style={{ 
      bottom, 
      left, 
      right, 
      zIndex,
      background: 'white' // Fallback
    }}>
      {/* Upper Half (White) */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-white"></div>
      
      {/* Lower Half (Color) */}
      <div className={`absolute bottom-0 left-0 w-full h-1/2 ${colorClass}`}></div>
      
      {/* Middle Seam (Belt) */}
      <div className="absolute top-1/2 left-0 w-full h-[2px] bg-black/10 -translate-y-1/2"></div>
      
      {/* Shine */}
      <div className="absolute top-2 left-2 w-4 h-2 bg-white rounded-full opacity-50 rotate-[-45deg]"></div>
    </div>
  );

  return (
    <div className="relative w-full max-w-sm mx-auto flex flex-col items-center mt-8 mb-8">
      
      {/* === 1. TOP CAP (Natural, small cap) === */}
      <div className="w-32 h-6 bg-red-600 border-[4px] border-b-0 border-black rounded-t-full z-20 -mb-1 relative"></div>

      {/* === 2. MAIN DOME (Glass container) === */}
      <div className={`
        relative w-72 h-72 bg-blue-50/30 border-[6px] border-black rounded-full overflow-hidden z-10 box-border
        ${isSpinning ? 'animate-shake' : ''}
      `}
      style={{ 
        background: 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(200,230,255,0.2) 100%)',
        boxShadow: 'inset 0 0 40px rgba(0,0,0,0.05)'
      }}
      >
        {/* Glass Reflections */}
        <div className="absolute top-10 right-8 w-12 h-6 bg-white rounded-full opacity-40 rotate-[-30deg] z-30 pointer-events-none"></div>
        <div className="absolute top-16 right-6 w-4 h-4 bg-white rounded-full opacity-60 z-30 pointer-events-none"></div>
        
        {/* Scattered Capsules (Upper half white, Lower half color) */}
        <div className="relative w-full h-full">
           {/* Capsule 1: Red */}
           {renderCapsule('bg-red-500', '10px', '20px', undefined, 'rotate-[-25deg]', '', 1)}
           
           {/* Capsule 2: Blue */}
           {renderCapsule('bg-blue-500', '15px', undefined, '30px', 'rotate-[15deg]', 'delay-75', 2)}

           {/* Capsule 3: Yellow */}
           {renderCapsule('bg-yellow-400', '50px', '10px', undefined, 'rotate-[85deg]', 'delay-100', 0)}

           {/* Capsule 4: Green */}
           {renderCapsule('bg-green-500', '60px', undefined, '20px', 'rotate-[-10deg]', 'delay-50', 1)}

           {/* Capsule 5: Purple */}
           {renderCapsule('bg-purple-400', '90px', '50px', undefined, 'rotate-[140deg]', '', 0)}
           
           {/* Capsule 6: Pink */}
           {renderCapsule('bg-pink-400', '100px', undefined, '50px', 'rotate-[30deg]', '', 0)}

           {/* Capsule 7: Orange (Center top) */}
           {renderCapsule('bg-orange-400', '120px', '30px', undefined, 'rotate-[-50deg]', 'delay-75', 1)}
        </div>
      </div>

      {/* Connection Neck */}
      <div className="w-56 h-6 bg-gray-800 border-x-[6px] border-black z-10 -mt-8 relative"></div>

      {/* === 3. BASE (Red Body) === */}
      <div className="w-64 h-56 bg-red-600 rounded-b-[2.5rem] rounded-t-lg border-[6px] border-black pop-shadow relative z-0 flex flex-col items-center justify-start pt-6 -mt-1">
        
        {/* Decorative Panel */}
        <div className="w-48 h-28 bg-red-700 rounded-xl border-[3px] border-black/10 absolute top-4 left-1/2 -translate-x-1/2"></div>

        {/* Handle Base */}
        <div className="bg-white w-28 h-28 rounded-full border-[5px] border-black flex items-center justify-center shadow-lg relative z-10 mt-2">
            {/* The Handle */}
            <button 
                onClick={handleClick}
                disabled={disabled || isSpinning}
                className={`
                    w-24 h-8 bg-gray-200 rounded-full absolute transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer border-[3px] border-gray-400
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}
                `}
                style={{ transform: `rotate(${handleRotation}deg)` }}
                aria-label="ガチャを回す"
            >
                 <div className="w-8 h-12 bg-gray-300 border-[3px] border-black rounded-lg absolute -top-2 left-1/2 -translate-x-1/2"></div>
            </button>
            <div className="w-5 h-5 bg-yellow-400 rounded-full border-[3px] border-black z-10"></div>
        </div>
        
        {/* Output Slot */}
        <div className="absolute bottom-4 w-32 h-14 bg-gray-900 rounded-t-xl border-t-[3px] border-x-[3px] border-gray-600 flex items-end justify-center overflow-hidden">
             {/* Exit Door */}
            <div className="w-full h-10 bg-black/40 border-t-2 border-gray-500"></div>
        </div>
      </div>

      {/* Action Text */}
      {!disabled && (
         <div className="mt-8">
            <button
                onClick={handleClick} 
                disabled={isSpinning}
                className="bg-yellow-400 text-black font-black text-2xl py-4 px-16 rounded-full border-[5px] border-black pop-shadow-active pop-shadow transition-transform hover:-translate-y-1 tracking-widest"
            >
                {isSpinning ? '......' : 'まわす！'}
            </button>
         </div>
      )}

      {disabled && (
          <div className="mt-6 bg-gray-800 text-white font-bold py-3 px-8 rounded-full border-[4px] border-black shadow-lg">
              今月はプレイ済みです
          </div>
      )}

    </div>
  );
};