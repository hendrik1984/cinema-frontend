import Login from './pages/Login';
import Movies from './pages/Movies';
import { isAuthenticated } from './utils/auth';
// import './App.css'

function App() {
  const path = window.location.pathname;

  if(path === '/movies') {
    if (!isAuthenticated()) {
      window.location.href = "/";
      return null
    } 

    return <Movies />;
  }
  
  return <Login />;
}

export default App
