import React, { useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ThemeContext } from './ThemeContext';
import RepositoryList from './RepoList';
import { RootState } from './store';

const UserProfile: React.FC = () => {
    const { theme } = useContext(ThemeContext)!;
    const user = useSelector((state: RootState) => state.user.data);
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const response = await fetch(`https://api.github.com/users/${user?.login}/repos`);
                const data = await response.json();
                setRepos(data);
            } catch (error) {
                console.error('Error fetching repositories:', error);
                setRepos([]);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchRepos();
        }
    }, [user]);

    if (!user) {
        return null;
    }

    return (
        <div className={`flex justify-center p-4`}>
            <div className={`max-w-md w-full p-6 rounded-lg shadow-md ${theme === 'light' ? 'bg-white text-black' : 'bg-gray-800 text-white'} mx-auto`}>
                <div className="flex items-center">
                    <img src={user.avatar_url} alt={`${user.login}'s avatar`} className="w-24 h-24 rounded-full mr-4" />
                    <div>
                        <h2 className="text-2xl font-bold">{user.name || user.login}</h2>
                        <p className="text-gray-600 dark:text-gray-300">@{user.login}</p>
                        {user.bio && <p className="mt-2">{user.bio}</p>}
                    </div>
                </div>
                <div className="mt-4">
                    <p><strong>Location:</strong> {user.location || 'Not available'}</p>
                    <p><strong>Repositories:</strong> {user.public_repos}</p>
                    <p><strong>Followers:</strong> {user.followers}</p>
                    <p><strong>Following:</strong> {user.following}</p>
                </div>
                <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-blue-500">
                    View GitHub Profile
                </a>
                {loading ? (
                    <div className="text-center mt-4">Loading repositories...</div>
                ) : (
                    <RepositoryList repos={repos} />
                )}
            </div>
        </div>
    );
}

export default UserProfile;