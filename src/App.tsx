import React, { useState, useEffect } from 'react';
import { Upload, Globe, Loader2, Timer, Github, Check, X } from 'lucide-react';
import { Octokit } from '@octokit/core';

// Initialize Octokit with the provided token
const octokit = new Octokit({
  auth: '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'
});

const USERNAME = 'kenz-developer';

export default function App() {
  const [repoName, setRepoName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showLink, setShowLink] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [isNameAvailable, setIsNameAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setShowLink(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Check repository name availability
  useEffect(() => {
    const checkRepoName = async () => {
      if (!repoName) {
        setIsNameAvailable(null);
        return;
      }

      setIsCheckingName(true);
      try {
        await octokit.request('GET /repos/{owner}/{repo}', {
          owner: USERNAME,
          repo: repoName,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        });
        setIsNameAvailable(false); // Repository exists
      } catch (error) {
        setIsNameAvailable(true); // Repository doesn't exist
      } finally {
        setIsCheckingName(false);
      }
    };

    const debounceTimer = setTimeout(checkRepoName, 500);
    return () => clearTimeout(debounceTimer);
  }, [repoName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !repoName || !isNameAvailable) return;

    setIsLoading(true);
    setError('');
    setSuccess('');
    setShowLink(false);
    setCountdown(null);

    try {
      // Create repository (now public for GitHub Pages)
      await octokit.request('POST /user/repos', {
        name: repoName,
        auto_init: true,
        private: false, // Changed to public for GitHub Pages support
        has_issues: false,
        has_projects: false,
        has_wiki: false,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });

      // Read file content
      const fileContent = await file.text();
      const contentBase64 = btoa(fileContent);

      // Create or update file in repository
      await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner: USERNAME,
        repo: repoName,
        path: 'index.html',
        message: 'Initial commit',
        content: contentBase64,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });

      // Enable GitHub Pages
      await octokit.request('POST /repos/{owner}/{repo}/pages', {
        owner: USERNAME,
        repo: repoName,
        source: {
          branch: 'main',
          path: '/'
        },
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });

      const url = `https://${USERNAME}.github.io/${repoName}`;
      setWebsiteUrl(url);
      setSuccess('Repository created successfully! Please wait while your website is being deployed...');
      setCountdown(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating the repository');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="flex-grow max-w-4xl mx-auto py-6 sm:py-12 px-4 w-full">
        <div className="text-center mb-8 animate-slide-up">
          <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow shadow-lg">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">GitHub Pages Publisher</h1>
          <p className="text-base sm:text-lg text-gray-600">Buat code mu online dengan github page</p>
          
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 space-y-4 sm:space-y-6 hover-scale">
            <div>
              <label htmlFor="repo-name" className="block text-sm font-medium text-gray-700 mb-1">
                Masukan nama repo sebagai nama website mu
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="repo-name"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  className={`block w-full px-4 py-2 sm:py-3 pr-10 rounded-lg border transition-all duration-200 ${
                    isNameAvailable === true
                      ? 'border-green-500 focus:ring-green-500'
                      : isNameAvailable === false
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-indigo-500'
                  } focus:border-indigo-500 focus:ring-2 focus:ring-opacity-50`}
                  placeholder="my-awesome-website"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {isCheckingName ? (
                    <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                  ) : repoName && isNameAvailable !== null ? (
                    isNameAvailable ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )
                  ) : null}
                </div>
              </div>
              <p className="mt-1.5 text-sm text-gray-500">
                This will be part of your website's URL
                {repoName && isNameAvailable === false && (
                  <span className="text-red-500 block mt-1 animate-fade-in">
                    Nama ini sudah digunakan, gunakan nama lain
                  </span>
                )}
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Upload file html kamu
              </label>
              <div className="mt-1 flex justify-center px-4 sm:px-6 pt-4 sm:pt-5 pb-4 sm:pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors duration-200 group cursor-pointer">
                <div className="space-y-2 text-center">
                  <Upload className="mx-auto h-10 sm:h-12 w-10 sm:w-12 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload files</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept=".html"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        required
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    HTML files only
                  </p>
                </div>
              </div>
            </div>

            {file && (
              <div className="flex items-center space-x-2 text-sm text-gray-600 animate-fade-in">
                <Upload className="h-4 w-4" />
                <span>{file.name}</span>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg animate-fade-in">
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 text-green-700 rounded-lg animate-fade-in">
                <div className="flex items-center space-x-2">
                  <span>{success}</span>
                  {countdown !== null && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <Timer className="h-4 w-4" />
                      <span>{countdown}s</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={!repoName || !file || isLoading || !isNameAvailable}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Publishing...</span>
                </div>
              ) : (
                <span>Publish Website</span>
              )}
            </button>
          </div>
        </form>

        {/* Popup for website link */}
        {showLink && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full transform transition-all animate-fade-in shadow-2xl">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Your Website is Ready! 🎉</h2>
              <p className="text-gray-600 mb-4">
                Yey sudah online nih, jika belum nline tungguin saja 1 menit lagi hehe:
              </p>
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-gray-50 rounded-lg text-indigo-600 font-medium hover:text-indigo-500 break-all hover:bg-gray-100 transition-colors duration-200"
              >
                {websiteUrl}
              </a>
              <button
                onClick={() => setShowLink(false)}
                className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <p>Situs web Anda akan dipublikasikan ke Halaman GitHub secara otomatis</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto py-4 sm:py-6 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-center space-x-2">
          <Github className="h-4 sm:h-5 w-4 sm:w-5 text-gray-600" />
          <a
            href="https://github.com/YoshCasaster"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm sm:text-base text-gray-600 hover:text-indigo-600 transition-colors duration-200"
          >
            Created by YoshCasaster
          </a>
        </div>
      </footer>
    </div>
  );
}
