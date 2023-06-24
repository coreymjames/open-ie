import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react';

type AppProviderProps = { children: React.ReactNode };

export type AppState = {
  remainingCredits: number;
  setRemainingCredits: Dispatch<SetStateAction<number>>;
};

export const AppContext = createContext<AppState>({
  remainingCredits: 50,
  setRemainingCredits: () => {},
});

export const AppContextProvider = ({ children }: AppProviderProps) => {
  const [remainingCredits, setRemainingCredits] = useState<number>(50);


  return <AppContext.Provider value={{remainingCredits, setRemainingCredits}}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};