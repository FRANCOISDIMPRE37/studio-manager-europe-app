module.exports = {
  apps: [{
    name: "studio-manager",
    script: "./dist/index.js",
    cwd: "/home/ubuntu/app_v2",
    watch: false,
    max_memory_restart: "512M",
    env: {
      NODE_ENV: "production",
      PORT: "3001"
    }
  }]
}
