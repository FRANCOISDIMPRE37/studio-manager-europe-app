module.exports = {
  apps: [{
    name: "studio-manager",
    script: "./dist/index.js",
    cwd: "/home/ubuntu/app_platform",
    watch: false,
    max_memory_restart: "512M",
    env: {
      NODE_ENV: "production",
      PORT: "3001",
      DATABASE_URL: "mysql://studiomanager:MonMdp456@bo810531-001.eu.clouddb.ovh.net:35120/studiomanager"
    }
  }]
}
