// function to encrypt the message with the password
export async function encryptMessage(message, password) {
  // initialized data to be in use
  password = new TextEncoder().encode(password)
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  message = new TextEncoder().encode(message)

  // make password an eligible key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw', password, 'PBKDF2', false, ['deriveKey']
  )

  // generate the encryption key
  const encryptionKey = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 600_000 },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )

  // encrypt the data
  const cipherText = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      encryptionKey,
      message
    )
  )

  // message to be encoded. Salt and IV aren't secret
  const result = new Uint8Array(16 + 12 + cipherText.length)
  result.set(salt, 0) // write from 0th byte to 15th (16 bytes)
  result.set(iv, 16) // write from 16th byte to 27th byte (12 bytes)
  result.set(cipherText, 28) // write from 28th byte till end
  return result
}
