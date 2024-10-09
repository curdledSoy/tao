import { defineAuthEventHandler } from '~/server/utils/auth'
import { randomUUID } from 'crypto'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export default defineAuthEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)
  if (!formData) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'No file uploaded'
    })
  }

  const file = formData.find(item => item.name === 'image')
  if (!file || !file.filename) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid file'
    })
  }

  const fileExtension = file.filename.split('.').pop()
  const fileName = `${randomUUID()}.${fileExtension}`
  const filePath = join(process.cwd(), 'public', 'uploads', fileName)

  try {
    await writeFile(filePath, file.data)
    return { url: `/uploads/${fileName}` }
  } catch (error) {
    console.error('Error uploading file:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Failed to upload file'
    })
  }
})