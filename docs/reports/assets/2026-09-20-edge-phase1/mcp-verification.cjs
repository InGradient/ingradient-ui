// Run from the phase-1 worktree; uses the installed CommonJS MCP SDK.
const fs = require('node:fs')
const { pathToFileURL } = require('node:url')
const { Client } = require('@modelcontextprotocol/sdk/client/index.js')
const { StreamableHTTPClientTransport } = require('@modelcontextprotocol/sdk/client/streamableHttp.js')
;(async () => {
  const { edgeRoutes } = await import(pathToFileURL(`${process.cwd()}/tests/probes/edge-routes.mjs`))
  const client = new Client({ name: 'edge-phase1-verification', version: '1' })
  await client.connect(new StreamableHTTPClientTransport(new URL('http://localhost:6016/mcp')))
  const representatives = [
    'pages-platform-0-0-1-auth-login-workspace--overview',
    'pages-medical-0-0-1-auth--login',
    'sandboxes-theme-lab--overview',
  ]
  const results = {}
  results.previews = await client.callTool({ name: 'preview-stories', arguments: {
    stories: [...edgeRoutes.map(({ id }) => id), ...representatives].map((storyId) => ({ storyId })),
  } })
  fs.writeFileSync(`${__dirname}/mcp-verification.json`, JSON.stringify(results, null, 2))
  console.log(JSON.stringify(results.previews))
  results.tests = await client.callTool({ name: 'run-story-tests', arguments: {
    a11y: true,
    stories: [
      'pages-edge-0-0-5-login--offline',
      'pages-edge-0-0-5-datasetselect--offline',
      'pages-edge-0-0-5-workspace--settings',
      ...representatives,
    ].map((storyId) => ({ storyId })),
  } }, undefined, { timeout: 300000 })
  fs.writeFileSync(`${__dirname}/mcp-verification.json`, JSON.stringify(results, null, 2))
  console.log(JSON.stringify(results.tests))
  await client.close()
})().catch((error) => { console.error(error); process.exitCode = 1 })
