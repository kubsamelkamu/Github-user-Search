import { useDispatch, useSelector } from 'react-redux';
import Header from './Header';
import SearchBar from './SearchBar';
import UserProfile from './UserProfile';
import Footer from './Footer';
import { ThemeProvider } from './ThemeContext';
import { fetchUserData } from './redux/UserSlice';
import TrendsSection from './Features';
import { FeaturedReposSection } from './Features';

function App() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    const handleSearch = (username) => {
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
                        {user.data && <UserProfile user={user.data} />}
                    </div>
                </main>
                <Footer />
            </div>
        </ThemeProvider>
    );
}

export default App;