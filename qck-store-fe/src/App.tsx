import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Navbar } from './navigation/Navbar';
import { useState } from 'react';
import { CurrentUserContext } from './UserContext';
import { User } from './types/user';
import { Route, Navigate, Routes } from 'react-router-dom';
import { Home } from './home/Home';
import { Login } from './login/Login';
import { Registration } from './registration/Registration';

function App() {
  const queryClient = new QueryClient();
  const [user, setUser]  = useState<User>();

  return (
    <QueryClientProvider client={queryClient}>
      <CurrentUserContext.Provider value={{ user, setUser }}>
          <Navbar />
          <Routes>
            <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/" /> : <Registration />} />
            <Route path="*" element={user ? <Navigate to="/" /> : <Navigate to="/login" />} />
          </Routes>
      </CurrentUserContext.Provider>
    </QueryClientProvider>
  )
}

export default App
