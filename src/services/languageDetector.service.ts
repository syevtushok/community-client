export const detectLanguage = (code: string): string => {
    if (!code?.trim()) return 'plaintext';

    const patterns = {
        python: {
            strong: ['def ', 'class:', 'if __name__', 'import numpy', 'import pandas'],
            keywords: ['self.', 'print(', 'elif ', 'None', 'True', 'False']
        },
        javascript: {
            strong: ['const ', 'let ', '=>', 'function*', 'async function'],
            keywords: ['console.log', 'typeof ', 'undefined', 'export ', 'import ']
        },
        typescript: {
            strong: ['interface ', 'type ', 'namespace ', 'enum '],
            keywords: ['readonly', 'private ', 'public ', 'protected ', 'implements ']
        },
        java: {
            strong: ['public class ', 'private ', 'protected ', '@Override', 'extends '],
            keywords: ['void ', 'new ', 'null', 'String[]', 'System.']
        },
        cpp: {
            strong: ['#include', 'namespace ', 'template<', 'std::'],
            keywords: ['cout', 'cin', 'nullptr', 'virtual']
        },
        csharp: {
            strong: ['using System', 'namespace ', 'public class ', 'async Task'],
            keywords: ['Console.', 'string[]', 'var ', 'await ']
        },
        sql: {
            strong: ['SELECT ', 'INSERT INTO ', 'CREATE TABLE ', 'ALTER TABLE '],
            keywords: ['FROM ', 'WHERE ', 'JOIN ', 'GROUP BY ']
        },
        html: {
            strong: ['<!DOCTYPE', '<html', '<head', '<body'],
            keywords: ['<div', '<span', '<p>', '<a ']
        }
    };

    const lowerCode = code.toLowerCase();

    // Calculate scores for each language
    const scores = Object.entries(patterns).map(([lang, pattern]) => {
        let score = 0;

        // Strong indicators (weight: 5)
        score += pattern.strong.reduce((acc, keyword) =>
            acc + (lowerCode.includes(keyword.toLowerCase()) ? 5 : 0), 0);

        // Regular keywords (weight: 2)
        score += pattern.keywords.reduce((acc, keyword) =>
            acc + (lowerCode.includes(keyword.toLowerCase()) ? 2 : 0), 0);

        // Additional syntax patterns
        switch (lang) {
            case 'python':
                if (code.includes('def ') && !code.includes('{')) score += 10;
                break;
            case 'javascript':
                if (/^(const|let|var|import)\s/.test(code)) score += 10;
                break;
            case 'typescript':
                if (code.includes(':') && /:\s*(string|number|boolean|any)\b/.test(code)) score += 10;
                break;
            case 'java':
                if (/^(public|private|protected)?\s*(class|interface|enum)\s+\w+/.test(code)) score += 10;
                break;
            case 'cpp':
                if (code.includes('#include') || /^(class|struct)\s+\w+\s*\{/.test(code)) score += 10;
                break;
            case 'csharp':
                if (code.includes('namespace ') || /\bclass\s+\w+\s*:/.test(code)) score += 10;
                break;
            case 'sql':
                if (/^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER)\b/i.test(code)) score += 10;
                break;
            case 'html':
                if (/<[^>]+>/.test(code)) score += 10;
                break;
        }

        return {lang, score};
    });

    // Get the language with highest score
    const bestMatch = scores.sort((a, b) => b.score - a.score)[0];
    return bestMatch.score > 0 ? bestMatch.lang : 'plaintext';
};