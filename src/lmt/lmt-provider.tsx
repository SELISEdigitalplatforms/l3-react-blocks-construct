import { createContext, ReactNode, useContext, useRef, useEffect } from 'react';
import { LMT } from './lmt';

interface LmtContextType {
  lmt: LMT | null;
}

const LmtContext = createContext<LmtContextType | undefined>(undefined);

type LmtProviderProps = {
  children: ReactNode;
  config: {
    serviceId: string;
    X_BLOCKS_KEY: string;
    baseUrl: string;
  };
};

export const LmtProvider = ({ children, config }: LmtProviderProps) => {
  const lmtInstance = useRef<LMT | null>(null);

  useEffect(() => {
    if (!lmtInstance.current) {
      lmtInstance.current = new LMT(config);
    }

    return () => {
      if (lmtInstance.current) {
        lmtInstance.current.shutdown();
        lmtInstance.current = null;
      }
    };
  }, [config.serviceId, config.X_BLOCKS_KEY, config.baseUrl, config]);

  return <LmtContext.Provider value={{ lmt: lmtInstance.current }}>{children}</LmtContext.Provider>;
};

// Custom hook to use LMT context
type UseLmtReturnType = {
  logger?: LMT['logger'];
  shutdown?: LMT['shutdown'];
  tracer?: LMT['tracer'];
};
export const useLmt = (): UseLmtReturnType => {
  const context = useContext(LmtContext);
  if (!context) {
    throw new Error('useLmt must be used within an LmtProvider');
  }
  return {
    tracer: context.lmt?.tracer,
    logger: context.lmt?.logger,
    shutdown: context.lmt?.shutdown,
  };
};
