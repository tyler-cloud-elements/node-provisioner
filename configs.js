module.exports = {
  port: 3000,
  logDirectory: "logs",
  logFile: "server.log",
  defaultInstanceName: 'Atul App',
  authHeader: '',
  baseUrl: 'https://staging.cloud-elements.com',
  // Any add elements here to add support
  quickbooks: {
    apiKey: '',
    apiSecret: '',
    use_sandbox: 'true',
    'authentication.type': 'oauth2'
  }
}