import React from 'react';
import useToken from './components/useToken';
import Routes from './components/Routes';
import Login from './components/Login';
import UserDetails from './components/UserDetails';

function App() {
  const { token, setToken } = useToken();
  const { isAdmin, setIsAdmin } = UserDetails();
  
  if(!token){
    return <Login setToken={setToken} setIsAdmin={setIsAdmin}/>
  }

  return (
    <div className="App">
        <Routes setToken={setToken} token={token} isAdmin={isAdmin}/>
    </div>
  );
}

export default App;
