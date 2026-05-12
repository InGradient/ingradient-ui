/**
 * Sandbox 실험 메타 — § 20.
 *
 * Sandbox 는 정식 page 승격 전 실험 공간. 각 sandbox 의 목적/가설/승격 기준을
 * Storybook docs page 에 명시하여 의도를 잃지 않게 한다.
 */

export interface SandboxMeta {
  service: 'platform' | 'edge' | 'medical'
  /** 한 줄 — 무엇을 실험하는지 */
  experimentGoal: string
  /** 가설 */
  hypothesis: string
  /** 어떤 기존 페이지/컴포넌트 위에 변형하는지 */
  basis: string
  /** 승격 대상 (pages/{service}/{version}/{page}) */
  promotionTarget: string
  /** § 20.3 의 6 기준 + experiment 별 추가 기준 */
  promotionCriteria: string[]
}

/**
 * sandbox 메타를 Storybook parameters 로 변환. docs.description.component 에 markdown 주입.
 */
export function defineSandbox(meta: SandboxMeta) {
  return {
    sandbox: meta,
    /** preset resolution 용 — decorator 가 handoff.service 와 동일 패턴으로 service 인식 */
    handoff: { service: meta.service },
    docs: {
      description: {
        component: renderSandboxMarkdown(meta),
      },
    },
  }
}

function renderSandboxMarkdown(m: SandboxMeta): string {
  const list = (items: string[]) => items.map((s) => `- [ ] ${s}`).join('\n')
  return [
    `## Sandbox Experiment`,
    ``,
    `**Service**: ${m.service}  `,
    `**Goal**: ${m.experimentGoal}  `,
    `**Hypothesis**: ${m.hypothesis}  `,
    `**Basis**: ${m.basis}  `,
    `**Promotion target**: \`${m.promotionTarget}\``,
    ``,
    `### Promotion Criteria (§ 20.3)`,
    list(m.promotionCriteria),
    ``,
    `> Sandbox 는 정식 \`pages/{service}/{version}\` 로 승격되기 전 실험 공간.`,
    `> 위 criteria 모두 통과 후 승격한다.`,
  ].join('\n')
}
