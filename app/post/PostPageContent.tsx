'use client'

import React, {useState} from 'react'
import PortableText from 'react-portable-text'
import {useForm, type SubmitHandler} from 'react-hook-form'

import Header from '../../components/Header'
import {urlFor} from '../../sanity'
import type {Comment, Post} from '../../typings'

interface Props {
  post: Post
}

interface CommentFormInput {
  _id: string
  name: string
  email: string
  comment: string
}

const PostPageContent = ({post}: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors, isSubmitting},
  } = useForm<CommentFormInput>({
    defaultValues: {
      _id: post._id,
      name: '',
      email: '',
      comment: '',
    },
  })

  const [submitted, setSubmitted] = useState(false)
  const [requestError, setRequestError] = useState('')

  const onSubmit: SubmitHandler<CommentFormInput> = async (data) => {
    setRequestError('')

    const response = await fetch('/api/createComment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      setSubmitted(false)
      setRequestError('Your comment could not be submitted. Please try again.')
      return
    }

    setSubmitted(true)
    reset({
      _id: post._id,
      name: '',
      email: '',
      comment: '',
    })
  }

  return (
    <main>
      <Header />

      <img className="h-56 w-full object-cover" src={urlFor(post.mainImage).url()} alt={post.title} />

      <article className="mx-auto max-w-3xl px-5 py-10">
        <h1 className="mb-3 text-4xl font-bold text-black">{post.title}</h1>
        <h2 className="mb-6 text-xl font-light text-gray-600">{post.description}</h2>

        <div className="mb-10 flex items-center space-x-3">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src={urlFor(post.author.image).url()}
            alt={post.author.name}
          />
          <p className="text-sm text-gray-700">
            Blog post by <span className="font-semibold text-green-600">{post.author.name}</span> on{' '}
            {new Date(post._createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="prose max-w-none">
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            content={post.body}
            serializers={{
              h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
                <h1 className="my-5 text-2xl font-bold" {...props} />
              ),
              h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
                <h2 className="my-5 text-xl font-bold" {...props} />
              ),
              normal: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
                <p className="my-5 leading-8 text-gray-800" {...props} />
              ),
              li: ({children}: {children?: React.ReactNode}) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({children, href}: {children?: React.ReactNode; href?: string}) => (
                <a href={href} className="text-blue-600 hover:underline">
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>

      <hr className="mx-auto my-5 max-w-3xl border border-green-500" />

      {submitted ? (
        <div className="mx-auto my-10 max-w-2xl rounded border border-green-500 bg-green-50 p-5">
          <h3 className="text-2xl font-bold text-green-700">Thank you for submitting your comment!</h3>
          <p className="mt-2 text-gray-700">Once it is approved in Sanity Studio, it will appear below.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto mb-10 flex max-w-2xl flex-col p-5">
          <h3 className="text-sm text-green-500">Enjoyed this article?</h3>
          <h4 className="text-3xl font-bold">Leave a comment below!</h4>
          <hr className="mt-2 py-3" />

          <input type="hidden" {...register('_id')} />

          <label className="mb-5 block">
            <span className="text-gray-700">Name</span>
            <input
              {...register('name', {required: true})}
              type="text"
              placeholder="John Doe"
              className="mt-1 block w-full rounded border px-3 py-2 shadow outline-none ring-yellow-500 focus:ring"
            />
          </label>

          <label className="mb-5 block">
            <span className="text-gray-700">Email</span>
            <input
              {...register('email', {required: true})}
              type="email"
              placeholder="johndoe@gmail.com"
              className="mt-1 block w-full rounded border px-3 py-2 shadow outline-none ring-yellow-500 focus:ring"
            />
          </label>

          <label className="mb-5 block">
            <span className="text-gray-700">Comment</span>
            <textarea
              {...register('comment', {required: true})}
              rows={8}
              placeholder="Liked this blog post"
              className="mt-1 block w-full rounded border px-3 py-2 shadow outline-none ring-yellow-500 focus:ring"
            />
          </label>

          <div className="flex flex-col p-2">
            {errors.name && <span className="text-red-500">Name is required</span>}
            {errors.email && <span className="text-red-500">Email is required</span>}
            {errors.comment && <span className="text-red-500">Comment is required</span>}
            {requestError && <span className="text-red-500">{requestError}</span>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer rounded-sm bg-green-500 px-4 py-2 font-bold text-white shadow hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Comment'}
          </button>
        </form>
      )}

      <section className="mx-auto mb-16 flex max-w-2xl flex-col space-y-4 px-5">
        <h3 className="text-4xl font-bold">Comments</h3>
        <hr className="pb-2" />

        {post.comments.length === 0 ? (
          <p className="text-gray-600">No approved comments yet. Be the first one to leave a comment.</p>
        ) : (
          post.comments.map((comment: Comment) => (
            <div key={comment._id} className="rounded border border-gray-200 p-4">
              <p className="font-semibold text-green-600">{comment.name}</p>
              <p className="mt-2 text-gray-700">{comment.comment}</p>
            </div>
          ))
        )}
      </section>
    </main>
  )
}

export default PostPageContent
