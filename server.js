const app = require('express')(),
  bodyParser = require('body-parser'),
  provisionRouter = require('./routers/provision'),
  {port, logDirectory, logFile} = require('./configs'),
  {getStatus, setupLogger} = require('./utils/utils')
  cors = require('cors'),
  e = require('./utils/error'),
  fs = require('fs'),
  morgan = require('morgan'),
  winston = require('winston'),
  methodOverride = require('method-override');

// Setup logger
if (!fs.existsSync(logDirectory)) {
  console.log(`Creating log directory ${logDirectory}`);
  fs.mkdirSync(logDirectory);
}
if (!fs.existsSync(`${logDirectory}/${logFile}`)) {
  console.log(`Creating log file ${logFile}`);
  fs.createWriteStream(`${logDirectory}/${logFile}`);
}

// Setup handlers, console and file loggers
const logger = winston.createLogger(setupLogger(winston, logDirectory, logFile));
app.use(morgan('combined', { stream: { write: (message, encoding) => { logger.info(message) } } }));
app.disable('x-powered-by');
app.use(methodOverride());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());

// Routes
app.use('/provision', provisionRouter);
app.route('/ping').all((req, res, next) => res.sendStatus(200));

// Default error routes
app.route('/').all((req, res, next) => next(new e.NotFound(`Resource not found`)));  
app.use((err, req, res, next) => {
  if (err.exception) console.error(err);
  res.status(getStatus(err.status)).json({ message: err.message });
});

// Server setup
const serverPort = process.env.PORT || port || 3000;
app.listen(serverPort, () => console.log(`Listening on port ${serverPort}\n`));