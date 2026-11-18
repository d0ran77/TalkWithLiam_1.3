import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

export type RouteTravelMode = 'driving' | 'bus';

export interface GroundedPlaceSource {
  title: string;
  uri: string;
  placeId?: string;
  reviewSnippets?: string[];
}

export interface RouteGuideResult {
  origin: string;
  mode: RouteTravelMode;
  summaryMarkdown: string;
  sources: GroundedPlaceSource[];
  generatedAt: string;
  cached?: boolean;
}

interface WillerbyRouteGuideContextValue {
  originInput: string;
  setOriginInput: (value: string) => void;
  mode: RouteTravelMode;
  activeResult: RouteGuideResult | null;
  isLoading: boolean;
  error: string | null;
  lookupRoute: (customOrigin?: string, targetMode?: RouteTravelMode) => Promise<void>;
  switchMode: (nextMode: RouteTravelMode) => Promise<void>;
  clearError: () => void;
}

const WillerbyRouteGuideContext = createContext<WillerbyRouteGuideContextValue | null>(null);

export const WillerbyRouteGuideProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [originInput, setOriginInput] = useState<string>('');
  const [mode, setMode] = useState<RouteTravelMode>('driving');
  const [activeResult, setActiveResult] = useState<RouteGuideResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clientCacheRef = useRef<Map<string, RouteGuideResult>>(new Map());
  const requestSeqRef = useRef<number>(0);

  const lookupRoute = useCallback(
    async (customOrigin?: string, targetMode?: RouteTravelMode) => {
      const originToQuery = (customOrigin !== undefined ? customOrigin : originInput).trim();
      const modeToUse = targetMode ?? mode;

      if (customOrigin !== undefined) {
        setOriginInput(customOrigin);
      }
      if (targetMode !== undefined) {
        setMode(targetMode);
      }

      if (originToQuery.length < 2) {
        setError('Please enter a starting postcode, village, or town (for example, HU5 2AA or Beverley).');
        return;
      }

      setError(null);
      const cacheKey = `${modeToUse}:${originToQuery.toLowerCase().replace(/\s+/g, ' ')}`;
      const cached = clientCacheRef.current.get(cacheKey);
      if (cached) {
        setActiveResult(cached);
        return;
      }

      const reqId = ++requestSeqRef.current;
      setIsLoading(true);

      try {
        const res = await fetch('/api/maps/route-guide', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            origin: originToQuery,
            mode: modeToUse,
          }),
        });

        const payload = await res.json().catch(() => ({}));

        if (reqId !== requestSeqRef.current) return;

        if (!res.ok) {
          setError(
            typeof payload?.error === 'string' && payload.error.trim()
              ? payload.error
              : 'Unable to fetch live Google Maps route details right now. Please try again.'
          );
          return;
        }

        const result: RouteGuideResult = {
          origin: typeof payload.origin === 'string' ? payload.origin : originToQuery,
          mode: payload.mode === 'bus' ? 'bus' : 'driving',
          summaryMarkdown: typeof payload.summaryMarkdown === 'string' ? payload.summaryMarkdown : '',
          sources: Array.isArray(payload.sources) ? payload.sources : [],
          generatedAt:
            typeof payload.generatedAt === 'string' ? payload.generatedAt : new Date().toISOString(),
          cached: Boolean(payload.cached),
        };

        clientCacheRef.current.set(cacheKey, result);
        setActiveResult(result);
      } catch {
        if (reqId !== requestSeqRef.current) return;
        setError(
          'A network issue interrupted the Google Maps lookup. Please check your connection and try again.'
        );
      } finally {
        if (reqId === requestSeqRef.current) {
          setIsLoading(false);
        }
      }
    },
    [originInput, mode]
  );

  const switchMode = useCallback(
    async (nextMode: RouteTravelMode) => {
      setMode(nextMode);
      const targetOrigin = (originInput.trim() || activeResult?.origin || '').trim();
      if (targetOrigin.length >= 2) {
        await lookupRoute(targetOrigin, nextMode);
      }
    },
    [originInput, activeResult, lookupRoute]
  );

  const clearError = useCallback(() => setError(null), []);

  return (
    <WillerbyRouteGuideContext.Provider
      value={{
        originInput,
        setOriginInput,
        mode,
        activeResult,
        isLoading,
        error,
        lookupRoute,
        switchMode,
        clearError,
      }}
    >
      {children}
    </WillerbyRouteGuideContext.Provider>
  );
};

export function useWillerbyRouteGuide(): WillerbyRouteGuideContextValue {
  const ctx = useContext(WillerbyRouteGuideContext);
  if (!ctx) {
    throw new Error('useWillerbyRouteGuide must be used within a WillerbyRouteGuideProvider');
  }
  return ctx;
}
