import React, { useContext, useState } from 'react';
import { ThemeContext } from './ThemeContext';

interface Repository {
    id: number;
    name: string;
    description: string;
    stargazers_count: number;
    forks_count: number;
    created_at: string;
    html_url: string;
    language: string;
    license: {
        name: string;
    };
}

interface RepositoryListProps {
    repos: Repository[];
}

const RepositoryList: React.FC<RepositoryListProps> = ({ repos }) => {
    const { theme } = useContext(ThemeContext)!;
    const [currentPage, setCurrentPage] = useState(1);
    const reposPerPage = 5;

    const indexOfLastRepo = currentPage * reposPerPage;
    const indexOfFirstRepo = indexOfLastRepo - reposPerPage;
    const currentRepos = repos.slice(indexOfFirstRepo, indexOfLastRepo);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    if (!repos || repos.length === 0) {
        return <p className={`text-center ${theme === 'light' ? 'bg-gray-100 text-black' : 'bg-gray-900 text-white'}`}>No repositories found.</p>;
    }

    return (
        <div className="space-y-4 mt-4">
            {currentRepos.map((repo) => (
                <div key={repo.id} className={`p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow ${theme === 'light' ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}>
                    <h3 className="text-xl font-semibold">{repo.name}</h3>
                    <p className="mt-1">{repo.description || 'No description available.'}</p>
                    <div className="mt-2 flex space-x-4 text-sm">
                        <span>⭐ {repo.stargazers_count}</span>
                        <span>🍴 {repo.forks_count}</span>
                        <span>📅 {new Date(repo.created_at).toLocaleDateString()}</span>
                        {repo.language && <span>🔤 {repo.language}</span>}
                        {repo.license && <span>📜 {repo.license.name}</span>}
                    </div>
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="mt-2 text-blue-500 hover:underline">
                        View Repository
                    </a>
                </div>
            ))}
            <div className="flex justify-center mt-4">
                {Array.from({ length: Math.ceil(repos.length / reposPerPage) }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={`px-4 py-2 mx-1 rounded ${theme === 'light' ? 'bg-gray-200 text-black' : 'bg-gray-700 text-white'} ${currentPage === index + 1 ? 'font-bold' : ''}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default RepositoryList;