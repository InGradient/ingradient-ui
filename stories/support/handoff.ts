/**
 * Design Handoff — § 22.
 *
 * 각 page story 에 디자인 확정 후 platform 개발자가 참조할 정보를 메타로 노출한다.
 * Storybook docs page 의 component description 에 markdown 으로 변환되어 표시된다.
 *
 * § 23 Scenario Matrix 는 `requiredScenarios` 항목으로 통합 — 디자인이 기본 화면에서만
 * 정상이지 않은지 확인하는 checklist.
 */

export interface Handoff {
  service: 'platform' | 'edge' | 'medical'
  version: string
  page: string
  /** Storybook navigation 의 reference story 경로. 예: "Pages / Platform / 0.0.1 / Catalog / Default" */
  referenceStory: string
  /** 사용 preset id. 예: "platform-0.0.1" */
  preset: string
  /** 사용 fixtures 경로. 예: "stories/fixtures/platform/0.0.1/catalog-scenarios.ts" */
  fixturesPath: string
  /** § 23 Scenario Matrix — 반드시 통과해야 할 scenario 목록 */
  requiredScenarios: string[]
  /** 주요 interaction 설명 */
  interactions: string[]
  /** platform 개발자가 mock → real 교체할 포인트 (구체적으로) */
  platformIntegration: string[]
}

/**
 * handoff 메타를 Storybook parameters 형태로 변환한다.
 * docs.description.component 에 markdown 을 주입.
 */
export function defineHandoff(handoff: Handoff) {
  return {
    handoff,
    docs: {
      description: {
        component: renderHandoffMarkdown(handoff),
      },
    },
  }
}

function renderHandoffMarkdown(h: Handoff): string {
  const list = (items: string[]) => items.map((s) => `- ${s}`).join('\n')
  return [
    `## Design Handoff`,
    ``,
    `**Service**: ${h.service}  `,
    `**Version**: ${h.version}  `,
    `**Page**: ${h.page}  `,
    `**Reference Story**: \`${h.referenceStory}\`  `,
    `**Preset**: \`${h.preset}\`  `,
    `**Fixtures**: \`${h.fixturesPath}\``,
    ``,
    `### Required Scenarios (§ 23)`,
    list(h.requiredScenarios),
    ``,
    `### 주요 Interaction`,
    list(h.interactions),
    ``,
    `### Platform Integration`,
    list(h.platformIntegration),
  ].join('\n')
}
