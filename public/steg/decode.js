// read image bytes
function readBytes(pixels, startBit, count) {
  const out = new Uint8Array(count)
  for (let i = 0; i < count * 8; i++) {
    const n = startBit + i
    const bit = pixels[Math.floor(n / 3) * 4 + (n % 3)] & 1 // lowest bit of R, G or B
    out[i >> 3] = (out[i >> 3] << 1) | bit // build each byte, first bit on the left
  }
  return out
}

export async function decodeMessage(file) {
  // convert file into raw bytes
  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  const context = canvas.getContext('2d', { willReadFrequently: true })
  context.drawImage(bitmap, 0, 0)
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
  const pixels = imageData.data

  // header constants
  const HEADER_BYTES = 9
  // calculate capacity and check if there can be message at all
  const capacity = Math.floor((imageData.width * imageData.height * 3) / 8)
  if (capacity < HEADER_BYTES) throw new Error('No hidden message found') // image too small to hold one
  // read header
  const HEADER = readBytes(pixels, 0, HEADER_BYTES)
  if (HEADER[4] & ~0b11) throw new Error('Unrecognized format or not a stego image')
  // check if image is encrypted
  const isEncrypted = HEADER[4] === 1
  // get message length
  const message_length = new DataView(HEADER.buffer).getUint32(5)
  if (length > capacity - HEADER_BYTES) throw new Error('Invalid or damaged data')
  // read message
  const messageBytes = readBytes(pixels, HEADER_BYTES * 8, message_length)

  return { messageBytes, isEncrypted }
}
