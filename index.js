require("dotenv").config()

const express = require("express")
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET

const app = express()
app.use(bodyParser.json())

const User = require("./models/User")

app.get("/users", (request, response) => {
  User.query().then(users => {
    response.json({ users })
  })
})

app.post("/signup", (request, response) => {
  User.signup(request.body.user).then(user => {
    response.json({ user })
  })
})

app.post("/login", (request, response) => {
  User.authenticate(request.body.user).then(user => {
    const data = { userId: user.id }
    const token = jwt.sign(data, JWT_SECRET)

    response.json({ token })
  }).catch(error => {
    console.error(error.message)
    response.status(401).json({
      error: "Bad username or password",
    })
  })
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}`))
