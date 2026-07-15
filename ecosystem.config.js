module.exports = {
  apps: [
    {
      name: 'cloudsaver-frontend',
      script: 'npm',
      args: 'run dev:frontend',
      cwd: '/home/jiang.guest/CloudSaver',
      watch: false,
    },
    {
      name: 'cloudsaver-backend',
      script: 'npm',
      args: 'run dev:backend',
      cwd: '/home/jiang.guest/CloudSaver',
      watch: false,
    }
  ]
};
