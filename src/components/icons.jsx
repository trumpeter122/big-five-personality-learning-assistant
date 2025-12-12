import { LuSparkles, LuCompass, LuSunMedium, LuHandshake, LuWind, LuMoon, LuSun, LuX } from 'react-icons/lu';

export const traitIcons = {
  O: LuSparkles,
  C: LuCompass,
  E: LuSunMedium,
  A: LuHandshake,
  N: LuWind
};

export const ThemeIcon = ({ mode }) => (mode === 'light' ? <LuMoon /> : <LuSun />);

export const CloseIcon = LuX;
