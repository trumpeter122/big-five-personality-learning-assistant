import { LuSparkles, LuCompass, LuSunMedium, LuHandshake, LuWind, LuMoon, LuSun, LuX } from 'react-icons/lu';
import type { IconType } from 'react-icons';
import type { TraitKey } from '../types';

export const traitIcons: Record<TraitKey, IconType> = {
  O: LuSparkles,
  C: LuCompass,
  E: LuSunMedium,
  A: LuHandshake,
  N: LuWind
};

export const ThemeIcon = ({ mode }: { mode: 'light' | 'dark' }) => (mode === 'light' ? <LuMoon /> : <LuSun />);

export const CloseIcon = LuX;
