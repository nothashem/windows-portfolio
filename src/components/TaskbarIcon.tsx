'use client'

import { motion } from 'framer-motion';
import { useSystemSounds } from '@/hooks/useSystemSounds';

interface TaskbarIconProps {
  icon: React.ReactNode;
  isOpen?: boolean;
  isActive?: boolean;
  onClick: () => void;
  tooltip?: string;
}

export const TaskbarIcon = ({ 
  icon, 
  isOpen = false, 
  isActive = false,
  onClick,
  tooltip
}: TaskbarIconProps) => {
  const sounds = useSystemSounds();

  return (
    <motion.div
      className="relative group"
    >
      <motion.button
        className={`
          h-full px-3 flex items-center justify-center
          transition-all duration-150 ease-in-out relative
        `}
        onClick={() => {
          sounds.playClick();
          onClick();
        }}
      >
        {/* Background hover effect */}
        <div className={`absolute inset-0 transition-all duration-200
                       ${isActive ? 'bg-white/15' : 'group-hover:bg-white/5'}`}
        />
        
        {/* Icon */}
        <div className={`relative z-10 transition-all duration-200
                       ${isActive ? 'text-white scale-105' : 
                         'text-white/70 group-hover:text-white'}`}>
          {icon}
        </div>

        {/* Active Indicator */}
        <div className={`absolute -bottom-[2px] left-1/2 transform -translate-x-1/2
                       transition-all duration-200 ${
                         isActive ? 'w-5 h-[2px] bg-white' :
                         isOpen ? 'w-3 h-[2px] bg-white/30' :
                         'w-0 h-[2px] bg-white/30 group-hover:w-3'
                       }`}
        />
      </motion.button>

      {/* Tooltip */}
      {tooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
                      opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-[#202020] text-white text-sm px-3 py-1 rounded-md whitespace-nowrap">
            {tooltip}
          </div>
        </div>
      )}
    </motion.div>
  );
}; 