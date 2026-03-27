import {createCommentInSanity, type CreateCommentInput} from '../createComment'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateCommentInput

    await createCommentInSanity(body)

    return Response.json({message: 'Comment submitted successfully'})
  } catch (error) {
    console.error(error)

    return Response.json({message: 'Could not submit comment'}, {status: 500})
  }
}
