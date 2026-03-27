import {notFound} from 'next/navigation'

import PostPageContent from '../PostPageContent'
import {sanityClient} from '../../../sanity'
import type {Post} from '../../../typings'

const postPageQuery = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  _createdAt,
  title,
  slug,
  author->{
    name,
    image
  },
  "comments": *[
    _type == "comment" && post._ref == ^._id && approved == true
  ] | order(_createdAt desc),
  mainImage,
  description,
  body
}`

async function getPost(slug: string) {
  return sanityClient.fetch<Post | null>(postPageQuery, {slug})
}

export default async function PostPage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  return <PostPageContent post={post} />
}
