module.exports = {
  apps: [{
    name: "website-frontend",
    script: "npx",
    args: "next start -p 3010",
  }, {
    name: "website-backend",
    script: "./server.js"
  }]
}
