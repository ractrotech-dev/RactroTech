export type UserProfile = {
  id: string
  email: string
  full_name: string | null
  username: string | null
  avatar_url: string | null
  provider: string
  bio: string | null
  website: string | null
  github: string | null
  twitter: string | null
  created_at: string
  updated_at: string
}

export type ProfileUpdateInput = Partial<
  Pick<UserProfile, 'full_name' | 'username' | 'avatar_url' | 'bio' | 'website' | 'github' | 'twitter'>
>
