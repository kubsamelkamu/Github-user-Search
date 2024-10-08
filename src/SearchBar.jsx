import PropTypes from 'prop-types';
import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { ThemeContext } from './ThemeContext';

function Search({ onSearch }) {
    const { theme } = useContext(ThemeContext);
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
    const [loading, setLoading] = useState(false); 

    useEffect(() => {
        if (inputValue.length > 0) {
            const fetchSuggestions = async () => {
                setLoading(true); // Set loading to true when starting to fetch data
                try {
                    const response = await axios.get(`https://api.github.com/search/users?q=${inputValue}`);
                    setSuggestions(response.data.items);
                    setShowSuggestions(true);
                } catch (error) {
                    console.error('Error fetching GitHub user suggestions:', error);
                    setSuggestions([]);
                    setShowSuggestions(true);
                } finally {
                    setLoading(false); 
                }
            };

            // Debounce the API request
            const debounceTimeout = setTimeout(fetchSuggestions, 300);

            return () => clearTimeout(debounceTimeout);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [inputValue]);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        setActiveSuggestionIndex(-1);
        if (e.target.value === '') {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (username) => {
        setInputValue(username);
        setShowSuggestions(false);
        onSearch(username);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            setActiveSuggestionIndex((prevIndex) =>
                prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
            );
        } else if (e.key === 'ArrowUp') {
            setActiveSuggestionIndex((prevIndex) =>
                prevIndex > 0 ? prevIndex - 1 : prevIndex
            );
        } else if (e.key === 'Enter') {
            if (activeSuggestionIndex >= 0) {
                handleSuggestionClick(suggestions[activeSuggestionIndex].login);
            }
        }else if(e.key === 'Escape'){
            setSuggestions([]);
            setShowSuggestions(false);
            e.target.blur();
        }
    };

    return (
        <div className="relative">
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown} 
                placeholder="Enter GitHub Username"
                aria-label="GitHub Username Search"
                className={`w-full p-2 border rounded-md focus:outline-none ${theme === 'light' ? 'bg-white text-black border-gray-300' : 'bg-gray-800 text-white border-gray-700'}`}
            />
            {loading && (
                <div className={`absolute z-10 w-full text-center ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} p-4`}>
                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-t-transparent border-gray-600 rounded-full" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )}
            {showSuggestions && suggestions.length === 0 && !loading && (
                <p className={`absolute z-10 w-full text-center text-red-500 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                    No users found
                </p>
            )}
            {showSuggestions && suggestions.length > 0 && !loading && (
                <ul className={`absolute z-10 w-full max-h-60 overflow-y-auto rounded-md shadow-lg ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-700'}`}>
                    {suggestions.map((user, index) => (
                        <li
                            key={user.id}
                            className={`p-2 cursor-pointer ${theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-700'} ${activeSuggestionIndex === index ? 'bg-blue-500 text-white' : ''}`}
                            onClick={() => handleSuggestionClick(user.login)}
                        >
                            {user.login}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

Search.propTypes = {
    onSearch: PropTypes.func.isRequired,
};

export default Search;
