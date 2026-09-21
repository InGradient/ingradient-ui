import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { ProductFlows } from './ProductFlows'
import { verifyPublicImports } from './public-imports'
import { EdgeWorkspaceFlow } from './EdgeWorkspaceFlow'

verifyPublicImports()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {location.pathname === '/edge-workspace' ? <EdgeWorkspaceFlow />
      : location.pathname === '/platform' ? <ProductFlows product="platform" />
      : location.pathname === '/edge' ? <ProductFlows product="edge" /> : <App />}
  </React.StrictMode>
)
