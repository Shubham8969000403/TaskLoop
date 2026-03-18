const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const { errorHandler } = require('./middleware/errorMiddleware')

dotenv.config({ path: '../.env' })

connectDB()

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json())

// Routes
app.use('/api/auth',     require('./routes/authRoutes'))
app.use('/api/tasks',    require('./routes/taskRoutes'))
app.use('/api/subtasks', require('./routes/subtaskRoutes'))
app.use('/api/users',    require('./routes/userRoutes'))
app.use('/api/invites',  require('./routes/inviteRoutes'))

app.get('/', (req, res) => res.json({ message: 'TaskLoop API running' }))

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))