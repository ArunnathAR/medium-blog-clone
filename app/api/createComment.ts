import {createClient} from '@sanity/client'

export interface CreateCommentInput {
  _id: string
  name: string
  email: string
  comment: string
}

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2026-03-25',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

export async function createCommentInSanity(input: CreateCommentInput) {
  const {_id, name, email, comment} = input

  return client.create({
    _type: 'comment',
    approved: false,
    name,
    email,
    comment,
    post: {
      _type: 'reference',
      _ref: _id,
    },
  })
}
