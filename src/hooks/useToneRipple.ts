import { useEffect, useRef, useState } from 'react';
import type { TraitKey } from '../types';

type ToneTheme = { accent: string; accent2: string; pill: string };
type ToneMap = Record<TraitKey, ToneTheme>;

interface RippleState {
  x: number;
  y: number;
  color: string;
  active: boolean;
}

export function useToneRipple(traitTones: ToneMap) {
  const [tone, setTone] = useState<TraitKey | null>(null);
  const [ripple, setRipple] = useState<RippleState | null>(null);
  const defaultVarsRef = useRef<ToneTheme | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const captureDefaultVars = () => {
    if (defaultVarsRef.current) return;
    const styles = getComputedStyle(document.documentElement);
    defaultVarsRef.current = {
      accent: styles.getPropertyValue('--accent'),
      accent2: styles.getPropertyValue('--accent-2'),
      pill: styles.getPropertyValue('--pill')
    };
  };

  const applyTone = (domain: TraitKey, evt?: { clientX: number; clientY: number }) => {
    const theme = traitTones[domain];
    if (!theme) return;
    captureDefaultVars();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    document.documentElement.style.setProperty('--accent', theme.accent);
    document.documentElement.style.setProperty('--accent-2', theme.accent2);
    document.documentElement.style.setProperty('--pill', theme.pill);
    setTone(domain);

    if (!evt) {
      setRipple((prev) => (prev ? { ...prev, active: true } : prev));
      return;
    }

    const margin = 80;
    const vw = window.innerWidth || 1200;
    const vh = window.innerHeight || 800;
    const pushToEdge = (value: number, size: number) => {
      if (value < size / 2) return margin;
      if (value > size / 2) return size - margin;
      return value;
    };
    const x = pushToEdge(evt.clientX, vw);
    const y = pushToEdge(evt.clientY, vh);

    setRipple({
      x,
      y,
      color: theme.accent,
      active: true
    });
  };

  const clearTone = () => {
    if (defaultVarsRef.current) {
      document.documentElement.style.setProperty('--accent', defaultVarsRef.current.accent);
      document.documentElement.style.setProperty('--accent-2', defaultVarsRef.current.accent2);
      document.documentElement.style.setProperty('--pill', defaultVarsRef.current.pill);
    }
    setTone(null);
    setRipple((prev) => (prev ? { ...prev, active: false } : null));
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setRipple(null);
      timeoutRef.current = null;
    }, 420);
  };

  useEffect(
    () => () => {
      clearTone();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    []
  );

  return { tone, ripple, applyTone, clearTone };
}
