import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import { explainTopicWithGemini, generateQuizWithGemini, analyzeSyllabusWithGemini } from './src/server/geminiApi.ts';

function studyFlowApiPlugin(): Plugin {
  return {
    name: 'studyflow-server-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        // Buffer request body
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json');
          try {
            const parsed = body ? JSON.parse(body) : {};

            if (req.url === '/api/agent/run' && req.method === 'POST') {
              const explanation = await explainTopicWithGemini(
                'Relational Normalization (1NF, 2NF, 3NF, BCNF)',
                'Database Management Systems',
                'In an unnormalized relational schema R, three primary anomalies arise: Insertion, Deletion, Update...'
              );
              return res.end(JSON.stringify({ success: true, explanation }));
            }

            if (req.url === '/api/tutor/explain' && req.method === 'POST') {
              const { topic, subject, noteContext } = parsed;
              const result = await explainTopicWithGemini(topic || 'Normalization', subject || 'DBMS', noteContext);
              return res.end(JSON.stringify({ success: true, explanation: result }));
            }

            if (req.url === '/api/quiz/generate' && req.method === 'POST') {
              const { topic, subject } = parsed;
              const questions = await generateQuizWithGemini(topic || 'Normalization', subject || 'DBMS');
              return res.end(JSON.stringify({ success: true, questions }));
            }

            if (req.url === '/api/syllabus/analyze' && req.method === 'POST') {
              const { syllabusText, subjectName } = parsed;
              const result = await analyzeSyllabusWithGemini(syllabusText || '', subjectName || 'Computer Science');
              return res.end(JSON.stringify({ success: true, analysis: result }));
            }

            res.statusCode = 404;
            return res.end(JSON.stringify({ error: 'Endpoint not found' }));
          } catch (err: any) {
            console.error('API middleware error:', err);
            res.statusCode = 500;
            return res.end(JSON.stringify({ error: err.message || 'Internal server error' }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), studyFlowApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});


