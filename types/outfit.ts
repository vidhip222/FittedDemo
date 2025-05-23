export interface Outfit {
  id: string
  user_id: string
  name: string
  items: any[] // This will be the array of clothing items
  occasion: string
  created_at: string
} 