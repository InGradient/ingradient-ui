export type MockUser = {
  id: string
  name: string
  email: string
  organization: string
  avatarUrl?: string
}

export const mockUsers: MockUser[] = [
  {
    id: 'u-001',
    name: 'Joon Ho Lee',
    email: 'joon@ingradient.dev',
    organization: 'Ingradient',
  },
  {
    id: 'u-002',
    name: 'Soyeon Kim',
    email: 'soyeon@acme.io',
    organization: 'Acme Inc.',
  },
  {
    id: 'u-003',
    name: 'Daniel Park',
    email: 'daniel@finemtech.co.kr',
    organization: 'Finemtech',
  },
]
