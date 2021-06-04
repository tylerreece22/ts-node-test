# PKG Debugging
Discovery repo for debugging a pkg application.

## Production Debugging

### Native Linux Commands
* ```ps aux``` view all running processes. I recommend running this command with a ```| grep {pkg file dir name}``` so you can see the actual process
* ```top``` shows process dashboard to see resource usage
    * ```htop``` is also a great command but requires an install
* ApacheBench comes with most *NIX OSs (though less recommended on a production server) and can provide some great profiling on an app. The following will create 20 connections with 250 requests each to the endpoint passed```ab -k -c 20 -n 250 "http://localhost:8080/auth?username=matt&password=password"``` and will provide a nice dashboard to show the effectiveness of the application
* DRAWBACKS:
  * Highly limited
  
### Node Profiling with Flame Graph (External tools)
* [0x](https://www.npmjs.com/package/0x) is a super simple flame graph generation package and does not require installation of linux modules
  * 0x has a [production specific "lightweight" approach](https://github.com/davidmarkclements/0x/blob/master/docs/production-servers.md#production-servers) as well
  * On the note of flame graphs```perf``` is a great as well but requires linux package installation and has more known issues than I am comfortable with
* DRAWBACKS: 
  * Downtime
  * Data collected locally
  * Does not work for PKG app
  
### Native Node "Inspector" Module
Inspector module is a great addition to a Node application (especially in a case where all you have is a PKG app on a server somewhere) which even enables profiling files to be pushed to S3 but PKG does not play nice with it because [Debugging options are disallowed , as pkg executables are usually used for production environments.](https://github.com/vercel/pkg#error-err_inspector_not_available) so it renders this functionality useless unless the application is rebuild with the ```---debug``` flag. Sad day.

### Conclusion
Although there are a lot of great profiling approaches out there (i.e. 0x, inspector module, clinicjs, etc) PKG significantly limits the ability to debug a production built application.

### Recommended Approach
Use linux commands in production to prevent downtime and replicate the application in a local environment to do more in depth profiling. Unfortunately during this research, I was unable to find an alternative approach.

### References
* [Node Flame Graph](https://nodejs.org/en/docs/guides/diagnostics-flamegraph/)
* [Multiple Profiling examples including the Inspector module](https://medium.com/voodoo-engineering/node-js-and-cpu-profiling-on-production-in-real-time-without-downtime-d6e62af173e2)
* [Inspector Module Docs](https://nodejs.org/docs/latest-v14.x/api/inspector.html)
* [PKG Docs](https://www.npmjs.com/package/pkg)
  
## Combining Microservices into a Single Pkg app
The purpose here is to retain runtime consistency and obfuscation while allowing breathing room for a longer term architecture. 

### Example
Entry point:

```javascript
const app1 = require('./express-app-1')
const app2 = require('./express-app-2')

app1()
app2()
```

App 1:
```javascript
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
res.send('Hello World from app 1!')
})

module.exports = () => app.listen(port, () => {
console.log(`App 1 listening at http://localhost:${port}`)
})
```

App 2:

```javascript
const express = require('express')
const app = express()
const port = 3001

app.get('/', (req, res) => {
res.send('Hello World from app 2!')
})

module.exports = () => app.listen(port, () => {
console.log(`App 2 listening at http://localhost:${port}`)
})
```

Result:
```
➜  pkg-debugging git:(master) ✗ ./microServiceApp 
App 1 listening at http://localhost:3000
App 2 listening at http://localhost:3001
```

  
