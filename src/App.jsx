import React, { useState, useEffect, useMemo } from 'react';
import algoData from '/src/data.json'

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

const CheckIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const BookmarkIcon = ({ className, isFilled }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFilled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
);

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
);
const PlatformIcon = ({ platform, className }) => {
  switch (platform.toLowerCase()) {
    case "leetcode":
      return (
        <div className={className}>
          {/* Light mode icon */}
          <img
            src="/leetcode_light.png"
            alt="LeetCode Light Icon"
            className="block dark:hidden"
          />
          {/* Dark mode icon */}
          <img
            src="/leetcode_dark.png"
            alt="LeetCode Dark Icon"
            className="hidden dark:block"
          />
        </div>
      );
    default:
      return (
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
          {platform}
        </span>
      );
  }
};

const HomePage = ({ setPage, completedCount, totalCount }) => (
  <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center px-4">
    <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px]"></div>

    <h1 className="text-5xl md:text-7xl font-bold text-black dark:text-white pb-4">
      Welcome to AlgoVerse
    </h1>
    <p className="mt-4 text-lg md:text-xl max-w-2xl text-gray-600 dark:text-gray-400">
      Your structured guide to mastering algorithmic patterns. Track your progress, create custom problem sets, and conquer the coding interview.
    </p>

    { completedCount > 0 && <p className="mt-6 text-md font-medium text-gray-700 dark:text-gray-300">
      You've completed <span className="text-green-600 dark:text-green-400 font-semibold">{completedCount}</span> of {totalCount} problems. Keep up the great work!
    </p>}

    <button
      onClick={() => setPage('patterns')}
      className="mt-8 px-8 py-3 bg-black text-white dark:bg-white dark:text-black font-semibold rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-300"
    >
      Explore Patterns
    </button>
  </div>
);



const ProblemItem = ({ problem, isCompleted, onToggleComplete, onSave, problemSets }) => {
  const isProblemSaved = Object.values(problemSets).some(set =>
    set.includes(problem.problem_id)
  );

  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-100/50 dark:hover:bg-white/5 transition-colors duration-200">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => onToggleComplete(problem.problem_id)}
          className={`w-6 h-6 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-all duration-300 ${isCompleted ? 'bg-black border-black dark:bg-white dark:border-white' : 'border-gray-300 dark:border-gray-600'}`}
        >
          {isCompleted && <CheckIcon className={`w-4 h-4 ${isCompleted ? 'text-white dark:text-black' : ''}`} />}
        </button>
        <p>{problem.problem_id}.</p>
        <a
          href={problem.problem_link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-800 dark:text-gray-200 hover:underline"
        >
          {problem.problem_title}
        </a>
      </div>

      <div className="flex items-center space-x-4">
        <div title={problem.platform}>
          <PlatformIcon platform={problem.platform} className="w-5 h-5" />
        </div>
        <button
          onClick={() => onSave(problem)}
          title={isProblemSaved ? "Manage saved sets" : "Save problem"}
          className={`transition-colors ${isProblemSaved ? "text-black dark:text-white" : "text-gray-400 hover:text-black dark:hover:text-white"}`}
        >
          <BookmarkIcon className="w-5 h-5" isFilled={isProblemSaved} />
        </button>
      </div>
    </div>
  );
};


const PatternCard = ({ pattern, problems, completedProblems, onToggleComplete, onSave, problemSets }) => {    const [isOpen, setIsOpen] = useState(false);
    
    const completedCount = useMemo(() => {
        return problems.filter(p => completedProblems.includes(p.problem_id)).length;
    }, [problems, completedProblems]);
    
    const progress = problems.length > 0 ? (completedCount / problems.length) * 100 : 0;
    const progressText = Math.round(progress);

    return (
        <div className="border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-black shadow-sm transition-shadow hover:shadow-lg">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full p-4 text-left flex justify-between items-center">
                <div>
                    <h3 className="font-semibold text-lg text-black dark:text-white">{pattern}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {completedCount} / {problems.length} problems completed
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="relative w-28 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-black dark:bg-white h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {progressText}%
                    </span>
                    <svg
                        className={`w-6 h-6 text-gray-500 transition-transform transform ${isOpen ? "rotate-180" : ""}`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>
            {isOpen && (
                <div className="border-t border-gray-200 dark:border-gray-800">
                    {problems.map((problem) => (
  <ProblemItem
    key={problem.problem_id}
    problem={problem}
    isCompleted={completedProblems.includes(problem.problem_id)}
    onToggleComplete={onToggleComplete}
    onSave={onSave}
    problemSets={problemSets} 
  />

                    ))}
                </div>
            )}
        </div>
    );
};


const PatternsPage = ({ problemsByPattern, completedProblems, onToggleComplete, onSave, problemSets }) => (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-8">Algorithm Patterns</h1>
        <div className="space-y-4">
            {Object.entries(problemsByPattern).map(([pattern, problems]) => (
                <PatternCard
                    key={pattern}
                    pattern={pattern}
                    problems={problems}
                    completedProblems={completedProblems}
                    onToggleComplete={onToggleComplete}
                    onSave={onSave}
                    problemSets={problemSets}
                />
            ))}
        </div>
    </div>
);

const SavedProblemsPage = ({ problemSets, setProblemSets, allProblems }) => {
    const [newSetName, setNewSetName] = useState("");
    const [confirmDelete, setConfirmDelete] = useState(null);

    const handleCreateSet = (e) => {
        e.preventDefault();
        if (newSetName && !problemSets[newSetName]) {
            setProblemSets(prev => ({ ...prev, [newSetName]: [] }));
            setNewSetName("");
        }
    };
    
    const requestDeleteSet = (setName) => {
        setConfirmDelete(setName);
    };

    const executeDeleteSet = () => {
        if (!confirmDelete) return;
        setProblemSets(prev => {
            const newSets = { ...prev };
            delete newSets[confirmDelete];
            return newSets;
        });
        setConfirmDelete(null); 
    };
    
    const handleRemoveProblem = (setName, problemId) => {
        setProblemSets(prev => ({
            ...prev,
            [setName]: prev[setName].filter(id => id !== problemId)
        }));
    };

    return (
        <>
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-black dark:text-white mb-8">My Problem Sets</h1>
                
                <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow-sm mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Create a New Set</h2>
                    <form onSubmit={handleCreateSet} className="flex space-x-4">
                        <input
                            type="text"
                            value={newSetName}
                            onChange={(e) => setNewSetName(e.target.value)}
                            placeholder="e.g., 'Dynamic Programming Practice'"
                            className="flex-grow p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-transparent focus:ring-black focus:border-black dark:focus:ring-white dark:focus:border-white text-black dark:text-white"
                        />
                        <button type="submit" className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black font-semibold rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                            Create Set
                        </button>
                    </form>
                </div>

                <div className="space-y-6">
                    {Object.keys(problemSets).length === 0 ? (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-10">You haven't created any problem sets yet. Use the form above to start!</p>
                    ) : (
                        Object.entries(problemSets).map(([setName, problemIds]) => (
                            <div key={setName} className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm">
                                <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
                                    <h3 className="font-semibold text-lg text-black dark:text-white">{setName}</h3>
                                    <button onClick={() => requestDeleteSet(setName)} className="text-sm text-red-600 hover:underline">Delete Set</button>
                                </div>
                                <div>
                                    {problemIds.length === 0 ? (
                                        <p className="p-4 text-gray-500 dark:text-gray-400">This set is empty. Save problems from the 'Patterns' page.</p>
                                    ) : (
                                        problemIds.map(id => {
                                            const problem = allProblems.find(p => p.problem_id === id);
                                            if (!problem) return null;
                                            return (
                                                <div key={id} className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-800 last:border-b-0">
                                                    <a href={problem.problem_link} target="_blank" rel="noopener noreferrer" className="text-gray-800 dark:text-gray-200 hover:underline">
                                                        {problem.problem_title}
                                                    </a>
                                                    <button onClick={() => handleRemoveProblem(setName, id)} className="text-xs text-gray-500 hover:text-red-600">Remove</button>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <ConfirmModal 
                isOpen={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                onConfirm={executeDeleteSet}
                title="Delete Problem Set"
                message={`Are you sure you want to delete the "${confirmDelete}" problem set? This action cannot be undone.`}
            />
        </>
    );
};

const SaveProblemModal = ({ isOpen, onClose, problem, problemSets, setProblemSets }) => {
  if (!isOpen) return null;

  const toggleProblemInSet = (setName) => {
    setProblemSets(prev => {
      const exists = prev[setName].includes(problem.problem_id);
      return {
        ...prev,
        [setName]: exists
          ? prev[setName].filter(id => id !== problem.problem_id) // remove
          : [...prev[setName], problem.problem_id] // add
      };
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">Save Problem</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-300">"{problem.problem_title}"</p>
        <h3 className="font-medium mb-2 text-gray-700 dark:text-gray-200">Add / Remove from sets:</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {Object.keys(problemSets).length > 0 ? (
            Object.keys(problemSets).map(setName => {
              const isInSet = problemSets[setName].includes(problem.problem_id);
              return (
                <button
                  key={setName}
                  onClick={() => toggleProblemInSet(setName)}
                  className={`w-full text-left p-3 rounded-md transition-colors ${
                    isInSet
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800"
                  }`}
                >
                  {setName} {isInSet && "✓"}
                </button>
              );
            })
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              No problem sets created yet. Go to 'My Sets' to create one.
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full p-2 bg-gray-200 dark:bg-gray-800 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};


const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">{title}</h2>
                <p className="mb-6 text-gray-600 dark:text-gray-300">{message}</p>
                <div className="flex justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};


export default function App() {
  const [page, setPage] = useState('home');
  const [completedProblems, setCompletedProblems] = useLocalStorage('completedProblems', []);
  const [problemSets, setProblemSets] = useLocalStorage('problemSets', {});
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [problemToSave, setProblemToSave] = useState(null);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  const handleToggleComplete = (problemId) => {
    setCompletedProblems(prev =>
      prev.includes(problemId)
        ? prev.filter(id => id !== problemId)
        : [...prev, problemId]
    );
  };
  
  const handleSaveProblem = (problem) => {
    setProblemToSave(problem);
    setModalOpen(true);
  };

const allProblems = algoData['problems'];

const uniqueProblems = Array.from(
  new Map(allProblems.map(p => [p.problem_id, p])).values()
);

const totalProblems = uniqueProblems.length;



  const problemsByPattern = useMemo(() => {
    return algoData.patterns.reduce((acc, pattern, index) => {
      acc[pattern] = algoData.problems.filter(p => p.pattern_index === index);
      return acc;
    }, {});
  }, []);

  const renderPage = () => {
    switch (page) {
      case 'patterns':
        return <PatternsPage 
                    problemsByPattern={problemsByPattern} 
                    completedProblems={completedProblems}
                    onToggleComplete={handleToggleComplete}
                    onSave={handleSaveProblem}
                    problemSets={problemSets} 

                />;
      case 'saved':
        return <SavedProblemsPage 
                    problemSets={problemSets} 
                    setProblemSets={setProblemSets}
                    allProblems={algoData.problems}
               />;
      case 'home':
      default:
        return <HomePage 
                    setPage={setPage} 
                    completedCount={completedProblems.length}
                    totalCount={totalProblems}
                />;
    }
  };

  return (
    <div className="bg-white dark:bg-black text-black dark:text-gray-200 min-h-screen font-sans">
      <header className="bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-6">
              <button onClick={() => setPage('home')} className="flex items-center space-x-2">
                 <svg className="w-8 h-8 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="text-2xl font-semibold text-black dark:text-white">AlgoVerse</span>
              </button>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button onClick={() => setPage('patterns')} className="font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Patterns</button>
              <button onClick={() => setPage('saved')} className="font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">My Sets</button>
              <button onClick={toggleTheme} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main>
        {renderPage()}
      </main>

      <SaveProblemModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        problem={problemToSave}
        problemSets={problemSets}
        setProblemSets={setProblemSets}
      />
    </div>
  );
}

