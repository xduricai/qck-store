import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NavBar } from './Navigation';
import './App.css'

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <NavBar />
    </QueryClientProvider>
  )
}

export default App
