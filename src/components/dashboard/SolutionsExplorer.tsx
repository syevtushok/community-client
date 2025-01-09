import {useEffect, useState} from "react";
import {ParticipantSolutions} from "../../types/dashboard";
import {api} from "../../services/api.service";
import {Card, CardContent, CardHeader, CardTitle} from "../ui/card";
import {detectLanguage} from "../../services/languageDetector.service.ts";
import { ChevronDown, ChevronUp, Calendar } from "lucide-react";

declare global {
    interface Window {
        Prism: {
            highlightAll: () => void;
            plugins: {
                autoloader: {
                    languages_path: string;
                }
            }
        }
    }
}

export const SolutionsExplorer = () => {
    const [solutions, setSolutions] = useState<ParticipantSolutions[]>([]);
    const [selectedParticipant, setSelectedParticipant] = useState<number | null>(null);
    const [prismLoaded, setPrismLoaded] = useState(false);
    const [expandedSolutions, setExpandedSolutions] = useState<number[]>([]);

    // Single Prism loading effect
    useEffect(() => {
        const loadPrism = async () => {
            // Remove any existing Prism scripts
            const existingScripts = document.querySelectorAll('script[data-prism]');
            existingScripts.forEach(script => script.remove());

            try {
                // Load CSS first
                const cssLink = document.createElement('link');
                cssLink.rel = 'stylesheet';
                cssLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css';
                document.head.appendChild(cssLink);

                // Load Prism core
                const prismCore = document.createElement('script');
                prismCore.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js';
                prismCore.setAttribute('data-prism', 'true');
                document.head.appendChild(prismCore);

                await new Promise<void>((resolve) => {
                    prismCore.onload = () => resolve();
                });

                // Load autoloader
                const autoloader = document.createElement('script');
                autoloader.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js';
                autoloader.setAttribute('data-prism', 'true');
                document.head.appendChild(autoloader);

                await new Promise<void>((resolve) => {
                    autoloader.onload = () => resolve();
                });

                // Configure autoloader path
                if (window.Prism) {
                    window.Prism.plugins.autoloader.languages_path =
                        'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/';
                    setPrismLoaded(true);
                }
            } catch (error) {
                console.error('Error loading Prism:', error);
            }

            return () => {
                document.querySelectorAll('script[data-prism]').forEach(script => script.remove());
                document.querySelectorAll('link[href*="prism"]').forEach(link => link.remove());
                setPrismLoaded(false);
            };
        };

        void loadPrism();
    }, []); // Only load once when component mounts

    // Fetch solutions
    useEffect(() => {
        const fetchSolutions = async () => {
            try {
                const data = await api.get<ParticipantSolutions[]>('/comparison/solutions/all');
                setSolutions(data);
                if (data.length > 0) {
                    setSelectedParticipant(data[0].participantId);
                }
            } catch (error) {
                console.error('Error fetching solutions:', error);
            }
        };
        void fetchSolutions();
    }, []);

    // Highlight code when participant changes or Prism loads
    useEffect(() => {
        if (prismLoaded && window.Prism) {
            setTimeout(() => {
                window.Prism.highlightAll();
            }, 0);
        }
    }, [selectedParticipant, prismLoaded, expandedSolutions]);

    const isToday = (date: string) => {
        const today = new Date();
        const solutionDate = new Date(date);
        return today.toDateString() === solutionDate.toDateString();
    };

    const getParticipantSolutions = () => {
        const participantSolutions = solutions.find(p => p.participantId === selectedParticipant)?.solutions || [];
        // Filter solutions to only show today's solutions
        return participantSolutions.filter(solution => isToday(solution.completedAt));
    };

    const getDifficultyClass = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy':
                return 'bg-green-400/10 text-green-400';
            case 'Medium':
                return 'bg-yellow-400/10 text-yellow-400';
            case 'Hard':
                return 'bg-red-400/10 text-red-400';
            default:
                return 'bg-gray-400/10 text-gray-400';
        }
    };

    const toggleSolution = (solutionId: number) => {
        setExpandedSolutions(prev =>
            prev.includes(solutionId)
                ? prev.filter(id => id !== solutionId)
                : [...prev, solutionId]
        );
    };

    const todaySolutions = getParticipantSolutions();

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-white">Solutions Explorer</CardTitle>
                        <span className="text-sm text-gray-400 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date().toLocaleDateString()}
                        </span>
                    </div>
                    <select
                        value={selectedParticipant || ''}
                        onChange={(e) => setSelectedParticipant(Number(e.target.value))}
                        className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white min-w-[200px]"
                    >
                        {solutions.map(participant => (
                            <option key={participant.participantId} value={participant.participantId}>
                                {participant.participantName}
                            </option>
                        ))}
                    </select>
                </div>
            </CardHeader>
            <CardContent>
                {todaySolutions.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        No solutions submitted today
                    </div>
                ) : (
                    <div className="space-y-4">
                        {todaySolutions.map(solution => (
                            <div
                                key={solution.id}
                                className="p-4 bg-gray-700/50 rounded-lg border border-gray-600"
                            >
                                <div
                                    className="flex justify-between items-start mb-2 cursor-pointer"
                                    onClick={() => toggleSolution(solution.id)}
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-white font-medium">{solution.taskName}</h3>
                                            {expandedSolutions.includes(solution.id)
                                                ? <ChevronUp className="w-4 h-4 text-gray-400" />
                                                : <ChevronDown className="w-4 h-4 text-gray-400" />
                                            }
                                        </div>
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium mt-1 inline-block ${
                                            getDifficultyClass(solution.difficulty)
                                        }`}>
                                            {solution.difficulty}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-400 text-sm">
                                            {new Date(solution.completedAt).toLocaleTimeString()}
                                        </p>
                                        <p className="text-gray-400 text-sm">
                                            {solution.timeSpent} minutes
                                        </p>
                                    </div>
                                </div>
                                {expandedSolutions.includes(solution.id) && solution.solution && (
                                    <div className="mt-2">
                                        <div className="text-sm text-gray-400 mb-2">
                                            Language: {detectLanguage(solution.solution)}
                                        </div>
                                        <pre className="bg-gray-900 p-4 rounded-md overflow-x-auto">
                                            <code className={`language-${detectLanguage(solution.solution)}`}>
                                                {solution.solution}
                                            </code>
                                        </pre>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};