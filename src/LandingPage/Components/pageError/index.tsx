import React from 'react';

const ErrorPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-200">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-4">Error Page</h1>
                <p className="text-lg">Oops! Something went wrong.</p>
            </div>
        </div>
    );
};

export default ErrorPage;
