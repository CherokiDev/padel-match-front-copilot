// eslint-disable-next-line no-undef
module.exports = {
  apps: [
    {
      name: "padel-match-frontend",
      script: "serve",
      env: {
        PM2_SERVE_PATH: "./dist",
        PM2_SERVE_PORT: 8080,
      },
      args: "-s",
    },
  ],
};
