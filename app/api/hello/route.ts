import {getHelloData} from '../hello'

export async function GET() {
  return Response.json(getHelloData())
}
