export type MockMember = {
  id: string
  name: string
  role: 'Owner' | 'Maintainer' | 'Labeler' | 'Reviewer' | 'Viewer'
  avatarUrl?: string
  initials?: string
}

export const mockMembers: MockMember[] = [
  { id: 'mb-1', name: 'June Lee', role: 'Owner', initials: 'JL' },
  { id: 'mb-2', name: 'Soyeon Park', role: 'Maintainer', initials: 'SP' },
  { id: 'mb-3', name: 'Daniel Kim', role: 'Labeler', initials: 'DK' },
  { id: 'mb-4', name: 'Mira Choi', role: 'Reviewer', initials: 'MC' },
  { id: 'mb-5', name: 'Yujin Han', role: 'Labeler', initials: 'YH' },
  { id: 'mb-6', name: 'Taemin Seo', role: 'Viewer', initials: 'TS' },
]
