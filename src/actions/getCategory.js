import { useState } from "react";

const useCategory = (token) => {
    const [categories, setCategories] = useState();
    const [error, setError] = useState()
    fetch('http://localhost:8000/categories', {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: "Bearer " + token.replace(/^"(.*)"$/, '$1')
        },
    })
        .then(async response => {
            const data = await response.json();

            if (!response.ok) {
                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }
            setCategories(data)
        })
        .catch(error => {
            setError({ errorMessage: error.toString() });
            console.error('There was an error!', error);
        });
    
    return {
        categories,
        error
    }
}

export default useCategory