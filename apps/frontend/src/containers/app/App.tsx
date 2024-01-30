import React from 'react';
import '@tldraw/tldraw/tldraw.css';
import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { StyledEngineProvider, ThemeProvider } from '@mui/material';
import { DrawingRoute } from '../../constants/routes';
import { useAppStyles } from './App.styles';
import Drawing from '../drawing/Drawing';
import AppContext from '../../context/AppContext';
import { theme } from '../../theme';
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const classes = useAppStyles();

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <StyledEngineProvider injectFirst>
              <AppContext>
                <div className={classes.content}>
                  <Routes>
                    {/* <Route 
                    path={'/'}
                    element={<Home />}
                  /> */}
                    <Route path={DrawingRoute} element={<Drawing />} />
                  </Routes>
                </div>
              </AppContext>
            </StyledEngineProvider>
          </QueryClientProvider>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
