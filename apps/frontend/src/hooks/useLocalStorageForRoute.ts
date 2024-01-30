import React, { useEffect, useState } from 'react';

function useLocalStorageForRoute(routeKey: string) {
    const [data, setData] = useState(localStorage.getItem(routeKey) || '');
  
    // Listen for changes in localStorage
    useEffect(() => {
      const handleStorageChange = (e: any) => {
        if (e.key === routeKey) {
          setData(e.newValue);
        }
      };
  
      window.addEventListener('storage', handleStorageChange);
  
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }, [routeKey]);
  
    const updateData = (newData: any) => {
      localStorage.setItem(routeKey, newData);
      setData(newData);
    };
  
    return [data, updateData];
  }

  export default useLocalStorageForRoute