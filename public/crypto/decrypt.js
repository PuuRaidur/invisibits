export async function decryptMessage(messageBytes, password) {
  // decryption constants
  const SALT_LENGTH = 16
  const IV_LENGTH = 12
  const TAG_LENGTH = 16 // AES-GCM adds a 16-byte auth tag

  // check if data is damaged or incomplete
  if (messageBytes.length < SALT_LENGTH + IV_LENGTH + TAG_LENGTH) {
    throw new Error('Encrypted data is damaged or incomplete')
  }

  // split bytes at same positions as in encryption
  const salt = messageBytes.slice(0, SALT_LENGTH) // 0-15
  const iv = messageBytes.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH) // 16-27
  const cipherText = messageBytes.slice(SALT_LENGTH + IV_LENGTH) // 28 to the end

  // generate key material for decryption key
  password = new TextEncoder().encode(password)
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    password,
    'PBKDF2',
    false,
    ['deriveKey']
  )

  // generate decryption key
  const decryptionKey = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 600_000 },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )

  // decrypt the message
  try {
    messageBytes = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, decryptionKey, cipherText)
    return new TextDecoder().decode(messageBytes)
  } catch(error) {
    throw new Error('Wrong password or the image data is damaged')
  }
}
