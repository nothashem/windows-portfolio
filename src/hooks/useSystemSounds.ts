import useSound from 'use-sound';
import { useVolume } from '@/contexts/VolumeContext';

export const useSystemSounds = () => {
  const { globalVolume, isMuted } = useVolume();
  
  // Calculate the effective volume (0 if muted, otherwise scaled by global volume)
  const effectiveVolume = isMuted ? 0 : globalVolume / 100;

  const soundConfig = {
    volume: effectiveVolume * 0.3, // Base volume of 0.3 scaled by effective volume
    onload: () => {},
    onloaderror: () => {}
  };

  const [playClick] = useSound('/sounds/click.mp3', { ...soundConfig, volume: effectiveVolume * 0.5 });
  const [playOpen] = useSound('/sounds/open.mp3', { ...soundConfig, volume: effectiveVolume * 0.5 });
  const [playClose] = useSound('/sounds/close.mp3', soundConfig);
  const [playMinimize] = useSound('/sounds/minimize.mp3', soundConfig);
  const [playMaximize] = useSound('/sounds/maximize.mp3', soundConfig);
  const [playError] = useSound('/sounds/error.mp3', soundConfig);
  const [playHover] = useSound('/sounds/hover.mp3', { ...soundConfig, volume: effectiveVolume * 0.1 });
  const [playStartup] = useSound('/sounds/startup.mp3', soundConfig);
  const [playNotification] = useSound('/sounds/notification.mp3', soundConfig);
  const [playStartMenu] = useSound('/sounds/start-menu.mp3', soundConfig);
  const [playSlider] = useSound('/sounds/slider.mp3', { ...soundConfig, volume: effectiveVolume * 0.2 });

  return {
    playClick,
    playOpen,
    playClose,
    playMinimize,
    playMaximize,
    playError,
    playHover,
    playStartup,
    playNotification,
    playStartMenu,
    playSlider
  };
}; 