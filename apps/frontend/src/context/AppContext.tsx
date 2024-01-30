import React, { FC, ReactNode } from 'react';
import { GlobalVariablesProvider } from './GlobalVariablesContext/GlobalVariablesContext';
import { ScaleProvider } from './ScaleContext';
import { LayerProvider } from './LayerContext/LayerContext';
import { LineTypeProvider } from './LineTypeContext/LineTypeContext';

interface Props {
  children: ReactNode;
}

const AppContext: FC<Props> = ({ children }) => {
  return (
    <GlobalVariablesProvider>
      <LineTypeProvider>
        <LayerProvider>
          <ScaleProvider>{children}</ScaleProvider>
        </LayerProvider>
      </LineTypeProvider>
    </GlobalVariablesProvider>
  );
};

export default AppContext;
