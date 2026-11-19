export async function encodeMessage(file, bytes, isEncrypted) {
  // build header for steganography status, password status and message length
  const MARKER = [0x53, 0x54, 0x45, 0x47]
  const ENCRYPTED = isEncrypted
  const MESSAGE_LENGTH = bytes.length
  const HEADER_BYTES = 9
  const PAYLOAD = new Uint8Array(HEADER_BYTES + MESSAGE_LENGTH)
  PAYLOAD.set(MARKER, 0)
  PAYLOAD[4] = ENCRYPTED
  new DataView(PAYLOAD.buffer).setUint32(5, MESSAGE_LENGTH)
  PAYLOAD.set(bytes, HEADER_BYTES)

  // convert image into raw bytes
  const imageBitmap = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  canvas.width = imageBitmap.width
  canvas.height = imageBitmap.height
  const context = canvas.getContext('2d', { willReadFrequently: true })
  context.drawImage(imageBitmap, 0, 0)
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
  const pixels = imageData.data

  // calculate maximum message length
  const capacity = Math.floor((canvas.width * canvas.height * 3) / 8) 
  // check if message too long
  if(PAYLOAD.length > capacity) throw new Error(`Message too long for image. Maximum length is ${capacity - HEADER_BYTES}`)

  // encode message into image
  for (let i = 0; i < PAYLOAD.length * 8; i++) {
    const bit = (PAYLOAD[i >> 3] >> (7 - (i & 7))) & 1 // next bit, most significant first
    const index = Math.floor(i / 3) * 4 + (i % 3) // pixel i/3, channel i%3, skipping alpha
    pixels[index] = (pixels[index] & 0xFE) | bit // replace the lowest bit
  }
  context.putImageData(imageData, 0, 0)

  // export modified image to PNG
  return new Promise((resolve, reject) => 
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("PNG export failed for some reason"))), 'image/png')
  )
}   
