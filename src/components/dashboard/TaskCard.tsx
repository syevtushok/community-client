import {SolutionData, Task} from "../../types/dashboard.ts";
import React, {useEffect, useState} from "react";
import {Card, CardContent} from "../ui/card.tsx";
import {CheckCircleIcon, ExternalLinkIcon} from "lucide-react";
import {DIFFICULTY_COLORS} from "../../config/constants.ts";
import {detectLanguage} from "../../services/languageDetector.service.ts";

export const TaskCard = (props: { task: Task }) => {
    const {task} = props;
    const [showSolutionForm, setShowSolutionForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [solution, setSolution] = useState('');
    const [language, setLanguage] = useState('plaintext');

    useEffect(() => {
        if (showSolutionForm) {
            const loadPrism = async () => {
                try {
                    // Load CSS first
                    const cssLink = document.createElement('link');
                    cssLink.rel = 'stylesheet';
                    cssLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css';
                    document.head.appendChild(cssLink);

                    // Load Prism core
                    const prismCore = document.createElement('script');
                    prismCore.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js';
                    document.head.appendChild(prismCore);

                    await new Promise((resolve) => {
                        prismCore.onload = resolve;
                    });

                    // Load autoloader for dynamic language loading
                    const autoloader = document.createElement('script');
                    autoloader.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js';
                    document.head.appendChild(autoloader);

                    await new Promise((resolve) => {
                        autoloader.onload = resolve;
                    });

                    // Configure autoloader path
                    if (window.Prism) {
                        window.Prism.plugins.autoloader.languages_path =
                            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/';
                    }

                    return () => {
                        document.head.removeChild(cssLink);
                        document.head.removeChild(prismCore);
                        document.head.removeChild(autoloader);
                    };
                } catch (error) {
                    console.error('Error loading Prism:', error);
                }
            };

            void loadPrism();
        }
    }, [showSolutionForm]);

    useEffect(() => {
        if (window.Prism && solution) {
            window.Prism.highlightAll();
        }
    }, [solution, language]);

    const handleSolutionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newSolution = e.target.value;
        setSolution(newSolution);
        if (newSolution.trim()) {
            const detectedLang = detectLanguage(newSolution);
            setLanguage(detectedLang);
            if (window.Prism) {
                setTimeout(() => window.Prism.highlightAll(), 0);
            }
        } else {
            setLanguage('plaintext');
        }
    };

    const handleSubmitSolution = async (solutionData: SolutionData) => {
        setError('');
        setIsSubmitting(true);
        try {
            const response = await fetch(`http://3.74.157.233:8080/dashboard/tasks/${task.id}/solution`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    timeSpent: solutionData.timeSpent,
                    userDifficulty: solutionData.userDifficulty,
                    solution: solutionData.solution || '',
                    language: language
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log('Error submitting solution:', errorData);
            }

            setShowSolutionForm(false);
            window.location.reload();
        } catch (error) {
            setError((error as Error).message || 'Failed to submit solution');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all">
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        {task.completed ? (
                            <CheckCircleIcon/>
                        ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-gray-600"/>
                        )}
                        <div>
                            <h3 className="font-medium text-white">{task.name}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                    DIFFICULTY_COLORS[task.difficulty]
                                }`}>
                                    {task.difficulty}
                                </span>
                                <span className="text-sm text-gray-400">{task.topic}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setShowSolutionForm(true)}
                            className="px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            Submit
                        </button>
                        <a
                            href={task.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            <ExternalLinkIcon/>
                        </a>
                    </div>
                </div>
            </CardContent>

            {showSolutionForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6">
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold text-white">Submit Solution</h2>
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            void handleSubmitSolution({
                                timeSpent: parseInt(formData.get('timeSpent') as string, 10),
                                userDifficulty: parseInt(formData.get('userDifficulty')?.toString() as string, 10),
                                solution: solution
                            });
                        }}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-1">
                                        Time Spent (minutes)
                                    </label>
                                    <input
                                        type="number"
                                        name="timeSpent"
                                        min="1"
                                        required
                                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-1">
                                        Difficulty Rating
                                    </label>
                                    <select
                                        name="userDifficulty"
                                        required
                                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select difficulty</option>
                                        <option value="1">Very Easy (1)</option>
                                        <option value="2">Easy (2)</option>
                                        <option value="3">Medium (3)</option>
                                        <option value="4">Hard (4)</option>
                                        <option value="5">Very Hard (5)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-1">
                                        Solution
                                    </label>
                                    <div className="relative">
                                        {/* Hidden textarea for input */}
                                        <textarea
                                            value={solution}
                                            onChange={handleSolutionChange}
                                            rows={8}
                                            className="absolute inset-0 opacity-0 w-full h-full"
                                            placeholder="Paste your solution here"
                                        />
                                        {/* Visible pre/code block for highlighting */}
                                        <pre
                                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[12rem] whitespace-pre-wrap">
            <code className={`language-${language}`}>
                {solution || ' '}
            </code>
        </pre>
                                        {language !== 'plaintext' && (
                                            <div className="absolute top-2 right-2">
                <span className="px-2 py-1 rounded-md bg-gray-600 text-xs text-gray-200">
                    {language}
                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {error && (
                                    <div className="text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="flex justify-end space-x-2 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowSolutionForm(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-md"
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-md flex items-center"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div
                                                    className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"/>
                                                Submitting...
                                            </>
                                        ) : (
                                            'Submit Solution'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Card>
    );
};
