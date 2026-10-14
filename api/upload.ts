import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleCors, requireAuth } from './_lib/cors'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: 'ohwpmgr1',
  api_key: '957245391313748',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'MSG-_kZUQOf1l1vDatdmI0i1cnY',
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const userId = await requireAuth(req, res)
  if (!userId) return

  try {
    const { image, folder = 'hesabika' } = req.body

    if (!image) return res.status(400).json({ error: 'Image data required (base64)' })

    const result = await cloudinary.uploader.upload(image, {
      folder: `hesabika/${folder}`,
      transformation: [
        { quality: 'auto', fetch_format: 'auto' },
        { width: 1200, crop: 'limit' },
      ],
    })

    res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
    })
  } catch (err) {
    console.error('Upload error:', err)
    res.status(500).json({ error: 'Upload failed' })
  }
}