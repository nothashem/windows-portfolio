import { motion } from 'framer-motion';
import { useSystemSounds } from '@/hooks/useSystemSounds';

interface TaskbarIconProps {
  id: string;
  icon: React.ReactNode;
  isOpen: boolean;
  isActive: boolean;
  onClick: () => void;
  tooltip: string;
}

export const TaskbarIcon: React.FC<TaskbarIconProps> = ({
  icon,
  isOpen,
  isActive,
  onClick,
  tooltip
}) => {
  const sounds = useSystemSounds();

  return (
    <motion.div
      className="relative group"
      onHoverStart={() => sounds.playHover()}
    >
      <motion.button
        className={`
          h-10 w-10 flex items-center justify-center rounded-md
          relative transition-colors duration-200
          ${isActive ? 'bg-white/20' : 'hover:bg-white/10'}
        `}
        onClick={() => {
          sounds.playClick();
          onClick();
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {icon}
        {isOpen && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-white" />
        )}
      </motion.button>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-black/90 text-white text-xs px-2 py-1 rounded">
          {tooltip}
        </div>
      </div>
    </motion.div>
  );
}; 