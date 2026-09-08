# Bug: Model-specific compat flags dropped when discovering models through Ollama Cloud

## Summary

Models discovered through the Ollama Cloud provider (`ollama-cloud/`) lose model-specific `compat` flags that are present in pi-ai's hardcoded provider metadata. This causes failures for models like Kimi K3 that depend on `thinkingFormat`, `requiresReasoningContentOnAssistantMessages`, or `deferredToolsMode`. Models without special compat requirements (e.g., GLM-5.2) work fine.

## Environment

- Letta Code 0.29.4
- Provider: Ollama Cloud, configured via `letta connect ollama-cloud`
- Failing model: `ollama-cloud/kimi-k3`
- Working model: `ollama-cloud/glm-5.2`

## Root cause

`parseOllamaShow()` in `src/backend/dev/pi-ollama-provider.ts` only extracts `vision` and `thinking` booleans from Ollama's `/api/show` response. It does not emit a `compat` object.

`buildModel()` in `src/backend/dev/pi-local-endpoint-provider.ts` then applies defaults:

```ts
compat: {
  supportsDeveloperRole: false,
  supportsReasoningEffort: false,
  ...metadata.compat   // empty for Ollama-discovered models
}
```

So the discovered model keeps `supportsReasoningEffort: false` and gets no `thinkingFormat`, `requiresReasoningContentOnAssistantMessages`, or `deferredToolsMode` — even though the same model under the Moonshot direct provider (`providers/data/moonshotai.json`) has all of these set.

For Kimi K3 specifically, the hardcoded Moonshot metadata includes:

| Flag | Moonshot direct | Ollama Cloud discovered |
|---|---|---|
| `supportsReasoningEffort` | `true` | `false` |
| `thinkingFormat` | `"openai"` | *(unset)* |
| `requiresReasoningContentOnAssistantMessages` | `true` | *(unset)* |
| `deferredToolsMode` | `"kimi"` | *(unset)* |

At request time, `reasoning_effort` is gated on `supportsReasoningEffort` in `openai-completions.js`, so it is never sent to Ollama Cloud even though Ollama's OpenAI-compatible API supports it.

## Expected behavior

When an Ollama-discovered model ID matches a known entry in pi-ai's provider data, the discovery path should merge `compat`, `thinkingLevelMap`, and `cost` from the known metadata.

## Suggested fix

In `buildModel`, cross-reference the discovered model ID against pi-ai's known provider model data and merge the missing fields:

```ts
function buildModel(metadata) {
  const known = lookupKnownModel(metadata.id);
  return {
    // ...
    compat: {
      supportsDeveloperRole: false,
      supportsReasoningEffort: false,
      ...known?.compat,     // merge known compat
      ...metadata.compat     // Ollama-specific overrides last
    },
    thinkingLevelMap: known?.thinkingLevelMap,
  };
}
```

## Workaround

Use `moonshot/kimi-k3` via `letta connect moonshotai` or `openrouter/moonshotai/kimi-k3` via `letta connect openrouter`, both of which use the correct hardcoded compat flags.