export const apiVersion = process.env.SANITY_API_VERSION || '2026-03-25'

const datasetValue =
  process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET

const projectIdValue =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID

if (!datasetValue) {
  throw new Error('Missing environment variable: SANITY_STUDIO_DATASET or NEXT_PUBLIC_SANITY_DATASET')
}

if (!projectIdValue) {
  throw new Error('Missing environment variable: SANITY_STUDIO_PROJECT_ID or NEXT_PUBLIC_SANITY_PROJECT_ID')
}

export const dataset = datasetValue
export const projectId = projectIdValue
