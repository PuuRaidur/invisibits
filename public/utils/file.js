export function downloadImage(blob, imageName) {
    // Get the original filename from the file input (or default)
    const originalName = imageName || "image.png"

    // Strip the extension to work with the name separately
    const dotIndex = originalName.lastIndexOf(".")
    const name = dotIndex > 0 ? originalName.slice(0, dotIndex) : originalName
    const ext = dotIndex > 0 ? originalName.slice(dotIndex) : ".png"

    // only append "_steg" if not already present
    const stegoName = name.endsWith("_steg") ? name : `${name}_steg`

    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${stegoName}${ext}`;
    a.click();
    URL.revokeObjectURL(a.href);
}

export function downloadMessage(message, imageName) {
  let messageFile
  if (imageName === undefined) messageFile = 'message.txt'
  else {
    const dotIndex = imageName.lastIndexOf('.')
    const name = imageName.slice(0, dotIndex)
    const ext = ".txt"
    messageFile = name.endsWith("_message") ? `${name}${ext}` : `${name}_message${ext}`
  }
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([message], { type: 'text/plain;charset=utf-8' }))
  a.download = messageFile
  a.click()
  URL.revokeObjectURL(a.href)
}
