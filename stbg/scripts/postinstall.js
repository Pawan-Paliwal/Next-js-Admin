const fs    = require('fs'),
      path  = require('path')

const cwd           = process.cwd(),
      envFile       = path.join(cwd, '.env'),
      envSampleFile = path.join(cwd, '.env-sample')

if(!fs.existsSync(envFile)) fs.copyFileSync(envSampleFile, envFile)
