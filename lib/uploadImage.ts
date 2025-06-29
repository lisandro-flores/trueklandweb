// lib/uploadImage.ts - Sistema de subida de imágenes
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './firebase'

export interface UploadResult {
  url: string
  path: string
}

export const uploadImage = async (
  file: File, 
  folder: string = 'products',
  userId: string
): Promise<UploadResult> => {
  try {
    // Validar archivo
    if (!file.type.startsWith('image/')) {
      throw new Error('El archivo debe ser una imagen')
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('La imagen no puede ser mayor a 5MB')
    }

    // Comprimir imagen si es necesario
    const compressedFile = await compressImage(file)

    // Crear nombre único
    const timestamp = Date.now()
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
    const fileName = `${timestamp}_${sanitizedFileName}`
    const filePath = `${folder}/${userId}/${fileName}`

    // Subir a Firebase Storage
    const storageRef = ref(storage, filePath)
    const snapshot = await uploadBytes(storageRef, compressedFile)
    const downloadURL = await getDownloadURL(snapshot.ref)

    return {
      url: downloadURL,
      path: filePath
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

export const uploadMultipleImages = async (
  files: File[],
  folder: string = 'products',
  userId: string
): Promise<UploadResult[]> => {
  if (files.length > 5) {
    throw new Error('Máximo 5 imágenes permitidas')
  }

  const uploadPromises = files.map(file => uploadImage(file, folder, userId))
  return Promise.all(uploadPromises)
}

export const deleteImage = async (imagePath: string): Promise<void> => {
  try {
    const imageRef = ref(storage, imagePath)
    await deleteObject(imageRef)
  } catch (error) {
    console.error('Error deleting image:', error)
    throw error
  }
}

// Función para comprimir imagen
const compressImage = async (file: File, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const img = new Image()

    img.onload = () => {
      // Calcular nuevas dimensiones manteniendo proporción
      const maxWidth = 1200
      const maxHeight = 1200
      let { width, height } = img

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
      }

      canvas.width = width
      canvas.height = height

      // Dibujar imagen redimensionada
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          const compressedFile = new File([blob!], file.name, {
            type: file.type,
            lastModified: Date.now()
          })
          resolve(compressedFile)
        },
        file.type,
        quality
      )
    }

    img.src = URL.createObjectURL(file)
  })
}
