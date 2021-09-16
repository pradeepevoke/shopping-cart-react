// import React from 'react';
  
function Logout() {
    localStorage.clear();
    window.location.href = '/';
}
  
export default Logout;


