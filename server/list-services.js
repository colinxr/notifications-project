const app = require('./src/app');
const serviceList = Object.keys(app.services);

console.log(serviceList.join('\n'));
