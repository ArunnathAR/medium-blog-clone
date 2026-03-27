import Link from 'next/link'

import Header from '../components/Header'
import {sanityClient, urlFor} from '../sanity'
import type {Post} from '../typings'

const homePageQuery = `*[_type == "post"] | order(_createdAt desc){
  _id,
  _createdAt,
  title,
  slug,
  author->{
    name,
    image
  },
  mainImage,
  description,
  body
}`

async function getPosts() {
  return sanityClient.fetch<Post[]>(homePageQuery)
}

export default async function HomePage() {
  const posts = await getPosts()

  return (
    <main className="mx-auto max-w-7xl">
      <Header />

      <section className="flex flex-col items-center justify-between gap-8 border-y border-black bg-[#f7f7f2] px-6 py-10 lg:flex-row lg:px-10 lg:py-16">
        <div className="space-y-5">
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-black md:text-6xl">
            <span className="underline decoration-black decoration-4">Medium</span> is a place to write,
            read, and connect.
          </h1>
          <p className="max-w-xl text-lg text-gray-700">
            Read beginner-friendly blog posts powered by Sanity, and open any post to view full content
            and comments.
          </p>
        </div>

        <img
          className="h-32 w-auto object-contain md:h-44 lg:h-56"
          src="/big-M.png"
          alt="Medium blog illustration"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post._id}
            href={`/post/${post.slug.current}`}
            className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition hover:shadow-lg"
          >
            <img
              className="h-60 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
              src={urlFor(post.mainImage).url()}
              alt={post.title}
            />

            <div className="flex items-center justify-between gap-4 p-5">
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-black">{post.title}</h2>
                <p className="mt-2 text-sm text-gray-600">
                  {post.description} by {post.author.name}
                </p>
              </div>

              <img
                className="h-12 w-12 rounded-full object-cover"
                src={urlFor(post.author.image).url()}
                alt={post.author.name}
              />
            </div>
          </Link>
        ))}
      </section>
    </main>
  )
}
