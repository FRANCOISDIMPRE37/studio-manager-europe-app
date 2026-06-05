module.exports = {
  apps: [{
    name: "studio-manager",
    script: "./dist/index.js",
    cwd: "/home/ubuntu/studio-manager-pwa",
    watch: false,
    max_memory_restart: "512M",
    env: {
      NODE_ENV: "production",
      PORT: "3001",
      DATABASE_URL: "mysql://studio:Intemporelle2024!@bo810531-001.eu.clouddb.ovh.net:35120/studio_intemporelle?ssl={\"rejectUnauthorized\":false}"
    }
  }]
}
