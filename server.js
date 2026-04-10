import jsonServer from 'json-server'

const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(jsonServer.bodyParser)

// POST /auth/login
server.post('/auth/login', (req, res) => {
  const { email, password } = req.body
  const db = router.db.getState()
  const user = db.users.find(u => u.email === email && u.password === password)

  if (user) {
    res.json({ user })
  } else {
    res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' })
  }
})

server.use(router)
server.listen(3000, () => {
  console.log('JSON Server running on port 3000')
})
