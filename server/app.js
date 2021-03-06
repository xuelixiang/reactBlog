const Koa = require('koa')
// const WebSocket = require('ws');
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')
const logger = require('koa-logger')
const errorHandle = require('./middlewares/errorHandle')
const checkToken = require('./middlewares/checkToken')

const router = require('./router')
const db = require('./models')

const app = new Koa()

app
  .use(cors())
  .use(errorHandle)
  .use(checkToken)
  .use(logger())
  .use(bodyParser())

app.use(router.routes(), router.allowedMethods())

app.listen(6060, () => {
  db.sequelize
    .sync({ force: false, logging: false }) // If force is true, each DAO will do DROP TABLE IF EXISTS ..., before it tries to create its own table
    .then(() => {
      // require('./initData')()

      console.log('sequelize connect success')
      console.log('sever listen on http://127.0.0.1:6060')
    })
    .catch(err => {
      console.log(err)
    })
})

// // 引用Server类:
// const WebSocketServer = WebSocket.Server;
// // 实例化:
// const wss = new WebSocketServer({
//   port: 3000
// });
// wss.on('connection', function (ws) {
//   console.log(`[SERVER] connection()`);
//   ws.on('message', function (message) {
//       console.log(`[SERVER] Received: ${message}`);
//       ws.send(`ECHO: ${message}`, (err) => {
//           if (err) {
//               console.log(`[SERVER] error: ${err}`);
//           }
//       });
//   })
// });
