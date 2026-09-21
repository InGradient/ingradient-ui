// Read-only official MCP documentation; run from the primary checkout.
const fs = require('node:fs');
const {Client} = require('@modelcontextprotocol/sdk/client/index.js');
const {StreamableHTTPClientTransport} = require('@modelcontextprotocol/sdk/client/streamableHttp.js');
(async()=>{
 const client=new Client({name:'edge-supplemental-audit',version:'1'});
 await client.connect(new StreamableHTTPClientTransport(new URL(process.env.STORYBOOK_MCP_URL || 'http://127.0.0.1:6015/mcp')));
 const results={};
 const tools=await client.listTools();
 console.log(JSON.stringify(tools.tools.find(t=>t.name==='get-documentation').inputSchema));
 results.instructions=await client.callTool({name:'get-storybook-story-instructions',arguments:{}});
 for(const id of ['components-overlays-twocolumndialog','components-overlays-dialogshell','components-charts-charttooltip','components-inputs-fieldrow-formfield','patterns-forms-daterangefield','patterns-cards-statcard']){
  results[id]=await client.callTool({name:'get-documentation',arguments:{id}});
  console.log(id,results[id].isError || false);
  fs.writeFileSync(__dirname+'/supplemental-mcp.json',JSON.stringify(results,null,2));
 }
 await client.close();
})().catch(e=>{console.error(e);process.exitCode=1});
