import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from './Header';
import SearchBar from './SearchBar';
import UserProfile from './UserProfile';
import Footer from './Footer';
import { ThemeProvider } from './ThemeContext';
import { fetchUserData } from './redux/UserSlice';
import TrendsSection from './Features';
import FeaturedReposSection from './Features';
import { RootState, AppDispatch } from './store'; // Import types

function App() {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.user);

    const handleSearch = (username: string) => {
        dispatch(fetchUserData(username));
    };

    return (
        <ThemeProvider>
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow container mx-auto p-4">
                    <div className="container mx-auto p-4">
                        <SearchBar onSearch={handleSearch} />
                        {user.error && <p className="text-center text-red-500">{user.error}</p>}
                        {!user.data && <TrendsSection />}
                        {!user.data && <FeaturedReposSection />}
                        {user.data && <UserProfile/>}
                    
                    </div>
                </main>
                <Footer />
            </div>
        </ThemeProvider>
    );
}

export default App;
