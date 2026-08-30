module.exports = {
  apps: [
    {
      name: 'nomini-backend',
      cwd: './backend',
      script: 'dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      env_production: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
      error_file: './logs/backend-err.log',
      out_file: './logs/backend-out.log',
      time: true,
    },
    {
      name: 'nomini-frontend',
      cwd: './frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      instances: 1,
      exec_mode: 'fork',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/frontend-err.log',
      out_file: './logs/frontend-out.log',
      time: true,
    },
  ],
};

