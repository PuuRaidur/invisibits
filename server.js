import express from "express"
import open from "open"

const app = express()
app.use(express.static("public"))

app.listen(8080, () => {
    console.log("Running at http://localhost:8080")
    open("http://localhost:8080")
})