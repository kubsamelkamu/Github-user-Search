import { ThemeContext } from "./ThemeContext";
import { useContext } from "react";
import PropTypes from 'prop-types';

function RepositoryList({repos}) {
    const theme = useContext(ThemeContext);

    if (!repos || repos.length === 0)  {
        return <p className={`text-center  ${theme === 'light' ? 'bg-gray-100 text-black' : 'bg-gray-900 text-white'}`}>No repositories found.</p>;
    }
    return (
        <div className="space-y-4 mt-4">
            {repos.map((repo) => (
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
        </div>
    );
}

RepositoryList.propTypes = {
    repos: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            description: PropTypes.string,
            stargazers_count: PropTypes.number.isRequired,
            forks_count: PropTypes.number.isRequired,
            created_at: PropTypes.string.isRequired,
            html_url: PropTypes.string.isRequired,
            language: PropTypes.string,
            license: PropTypes.shape({
                name: PropTypes.string,
            }),
        })
    ).isRequired,
    isLoading: PropTypes.bool,
};


export default RepositoryList;

