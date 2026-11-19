# InvisiBits

InvisiBits is a tool of simple design for hiding/revealing text messages within images using [LSB technique](https://medium.com/@renantkn/lsb-steganography-hiding-a-message-in-the-pixels-of-an-image-4722a8567046)

## Features

- encoding messages into images
- decoding messages from images
- encrypting/decrypting images with password
- download extracted message

## Prerequisites

- Node.js 24 or newer
- npm 12

## Setup

```bash
git clone https://gitea.kood.tech/georgkaasik/invisibits.git
cd invisibits
npm install
npm start
```
- tool available on [localhost:3000](http://localhost:3000)

## Usage

### Hiding message:

1. Select the image where the message will be hidden
2. Write the message to be hidden
3. Optional password to protect the message
4. Click "Hide"
5. Download the steganographic image

### Revealing message:

1. Select the image where the message will be extracted from
2. Type in password, if the hidden message is password-protected
3. Click "Reveal"
4. Optionally download the revealed message
