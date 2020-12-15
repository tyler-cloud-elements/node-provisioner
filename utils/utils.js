module.exports = {
  getStatus: (statusCode) => statusCode >= 100 && statusCode < 600 ? statusCode : 500,
  setupLogger: (winston, logDirectory, logFile) => ({
    transports: [
      new winston.transports.File({
        level: 'info',
        filename: `./${logDirectory}/${logFile}`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, //5MB
        maxFiles: 5,
        colorize: true
      }),
      new winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true
      })
    ],
    exitOnError: false
  }),
}