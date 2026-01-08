import schoolsData from '@/lib/data.json'

export type School = {
  id: number
  name: string
  type: string
  sector: string
  city: string
  price: string | number
  rate: number
  salary?: string
  url?: string
  rank?: number
}

export const schools = (schoolsData as any).schools as School[]

export function getSchoolById(id: number): School | undefined {
  return schools.find(school => school.id === id)
}

export function searchSchools(query: string): School[] {
  const lowerQuery = query.toLowerCase()
  return schools.filter(school => 
    school.name.toLowerCase().includes(lowerQuery) ||
    school.city.toLowerCase().includes(lowerQuery) ||
    school.type.toLowerCase().includes(lowerQuery)
  )
}
