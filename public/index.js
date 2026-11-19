// CONSTANTS
const image_input = document.querySelector("#image")
const message_field = document.querySelector("#message")
const password_field = document.querySelector("#password")

const encode_button = document.querySelector("#encode")
const encode_status = document.querySelector("#encode-status")
const decode_button = document.querySelector("#decode")
const decode_status = document.querySelector("#decode-status")

const steg_image = document.querySelector("#steg-image")
const download_image = document.querySelector("#download-image")
const extracted = [...document.querySelectorAll(".extracted")]
const extracted_message = document.querySelector("#extracted-message")
const download_message = document.querySelector("#download-message")
const preview = [...document.querySelectorAll(".preview")]

// Used variables
let file
let message
let password

// Event-Listeners
image_input.addEventListener("change", () => {
  file = image_input.files[0]
  if (!file) return
  if (preview[1].src) URL.revokeObjectURL(preview[1].src)

  const MAX_BYTES = 5 * 1024 * 1024 // 5 MB
  if(file.size > MAX_BYTES) {
    alert("File too big, max 5 MB!")
    return
  }
  encode_status.hidden = true
  decode_status.hidden = true
  extracted[0].hidden = true
  extracted_message.hidden = true
  extracted[1].hidden = true
  steg_image.hidden = true

  preview[1].src = URL.createObjectURL(file)
  preview[0].hidden = false
  preview[1].hidden = false
})

message_field.addEventListener("change", () => {
  message = message_field.value
})

password_field.addEventListener("change", () => {
  password = password_field.value
})

encode_button.addEventListener("click", async () => {
  if (confirm("Hide the message?")) {
    try {
      if (!file && !message) throw new Error("No image selected and message typed")
      if (!file) throw new Error("No image selected")
      if (!message) throw new Error("No message")
      const {encryptMessage} = await import("./crypto/encrypt.js")
      const {encodeMessage} = await import("./steg/encode.js")
      let bytes;
      if (password) {
        bytes = await encryptMessage(message, password);
        file = await encodeMessage(file, bytes, 1);
      } else {
        bytes = new TextEncoder().encode(message);
        file = await encodeMessage(file, bytes, 0);
      }
      URL.revokeObjectURL(preview[1].src)
      preview[1].src = URL.createObjectURL(file)
      preview[0].hidden = false
      preview[1].hidden = false

      steg_image.hidden = false
      extracted[0].hidden = true
      extracted_message.hidden = true
      extracted[1].hidden = true

      encode_status.textContent = "Encode successful!"
      encode_status.style = "color: lightgreen;"
      encode_status.hidden = false
      decode_status.hidden = true
    } catch(error) {
      encode_status.textContent = `Encode failed! ${error.message}!`
      encode_status.style = "color: red;"
      encode_status.hidden = false
      decode_status.hidden = true
    }
  }
})

decode_button.addEventListener("click", async () => {
  if (confirm("Reveal the message?")) {
    const {decodeMessage} = await import("./steg/decode.js")
    const {decryptMessage} = await import("./crypto/decrypt.js")
    try {
      if(!file) throw new Error("No image selected")
      const {messageBytes, isEncrypted} = await decodeMessage(file)
      if (isEncrypted) {
        if (!password) throw new Error('Image needs password')
        message = await decryptMessage(messageBytes, password)
      } else message = new TextDecoder().decode(messageBytes)
      encode_status.hidden = true
      decode_status.hidden = false
      decode_status.textContent = "Decode successful!"
      decode_status.style = "color: lightgreen;"

      extracted_message.textContent = `"${message}"`

      steg_image.hidden = true
      extracted[0].hidden = false
      extracted_message.hidden = false
      extracted[1].hidden = false

      preview[0].hidden = true
      preview[1].hidden = true
    } catch(error) {
      decode_status.textContent = `Decode failed! ${error.message}!`
      decode_status.style = "color: red;"
      encode_status.hidden = true
      decode_status.hidden = false
    }
  }
})

download_image.addEventListener("click", async () => {
  const {downloadImage} = await import("./utils/file.js")
  if (!file) return
  downloadImage(file, image_input?.files[0]?.name)
})

download_message.addEventListener("click", async () => {
  const {downloadMessage} = await import("./utils/file.js")
  if (!message) return
  downloadMessage(message, image_input?.files[0]?.name)
})
