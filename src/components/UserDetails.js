import { useState } from "react";

const UserDetails = () => {
    const [ isAdmin, setIsAdmin ] = useState(false)
    
    const setUserDetails = (token) => {
        fetch(`http://localhost:8000/currentuser`, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: "Bearer " + token.replace(/^"(.*)"$/, '$1')
        },
    })
        .then(async response => {
            const data = await response.json();
            localStorage.setItem('user_details', JSON.stringify(data));
            if (data.user_role.name === "admin") {
                localStorage.setItem('isAdmin', true);
                setIsAdmin(true)
            }
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    }
    return {
        setIsAdmin : setUserDetails,
        isAdmin
    }
}
export default UserDetails