import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

function datasetsApiPlugin() {
  return {
    name: 'datasets-api-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/datasets')) {
          return next();
        }

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');

        try {
          const parsedUrl = new URL(req.url, 'http://localhost:5173');
          const pathname = parsedUrl.pathname;
          const searchParams = parsedUrl.searchParams;

          const { DatasetService } = await server.ssrLoadModule('/src/services/datasetService.js');

          if (pathname === '/api/datasets/sources') {
            const sources = await DatasetService.getDatasetSources();
            return res.end(JSON.stringify({ success: true, data: sources }));
          }

          if (pathname === '/api/datasets/search') {
            const q = searchParams.get('q') || '';
            const country = searchParams.get('country') || 'All';
            const year = searchParams.get('year') || 'All';
            const metricType = searchParams.get('metricType') || 'All';
            const results = await DatasetService.searchDatasets(q, { country, year, metricType });
            return res.end(JSON.stringify({ success: true, count: results.length, data: results }));
          }

          if (pathname.startsWith('/api/datasets/disease/')) {
            const diseaseName = decodeURIComponent(pathname.replace('/api/datasets/disease/', ''));
            const results = await DatasetService.getDiseaseDatasets(diseaseName);
            return res.end(JSON.stringify({ success: true, count: results.length, data: results }));
          }

          if (pathname.startsWith('/api/datasets/statistics/')) {
            const diseaseName = decodeURIComponent(pathname.replace('/api/datasets/statistics/', ''));
            const country = searchParams.get('country') || 'All';
            const year = searchParams.get('year') || 'All';
            const stats = await DatasetService.getDiseaseStatistics(diseaseName, { country, year });
            return res.end(JSON.stringify({ success: true, data: stats }));
          }

          const datasetId = pathname.replace('/api/datasets/', '');
          if (datasetId && !datasetId.includes('/')) {
            const dataset = await DatasetService.getDatasetById(datasetId);
            if (dataset) {
              return res.end(JSON.stringify({ success: true, data: dataset }));
            }
          }

          res.statusCode = 404;
          return res.end(JSON.stringify({ success: false, error: 'Dataset or endpoint not found' }));
        } catch (err) {
          res.statusCode = 500;
          return res.end(JSON.stringify({ success: false, error: err.message }));
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [datasetsApiPlugin(), react(), tailwindcss()],
})
