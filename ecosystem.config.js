module.exports = {
  apps : [{
    name: "Explorer Api",
    script: "./dist/server.js",
    instances: "max",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}