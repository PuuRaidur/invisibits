import express from "express"
import open from "open"

const app = express()
app.use(express.static("public"))

app.listen(3000, () => {
    console.log("Running at http://localhost:3000")
    open("http://localhost:3000")
})
