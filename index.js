const express = require('express')
const uuid = require('uuid')
const app = express()
const port = 3000
app.use(express.json()) // declaração deve estar antes das rotas

/*
    - Query params => meusite.com/users?name=Edson&age=40 // FILTROS
    - Route params => /users/2 // BUSCAR, DELETAR OU ATUALIZAR ALGO ESPECÍFICO
    - Request Body => { "name":"Edson", "age": 40 }

    - GET          => Buscar informação no back-end
    - POST         => Criar informação no back-end
    - PUT/PATCH    => Alterar/Atualizar informação no back-end
    - DELETE       => Deletar informação no back-end

    - Middleware   => Interceptador -> Tem o poder de parar ou alterar dados da requisição
*/

const users = []

const checkUserId = (request, response, next) => {
    const { id } = request.params
    const index = users.findIndex(user => user.id === id)

    if (index < 0) {
        return response.status(404).json({ error: "User not found!" })
    }

    request.userInedx = index
    request.userId = id

    next()
}

app.get('/users', (request, response) => {
    return response.json(users)
})

app.post('/users', (request, response) => {
    const { name, age } = request.body

    const user = { id: uuid.v4(), name, age }
    users.push(user)

    return response.status(201).json(user)
})

app.put('/users/:id', checkUserId, (request, response) => {
    const { name, age } = request.body
    const index = request.userInedx
    const id = request.userId
    const updateUser = { id, name, age }
    
    users[index] = updateUser

    return response.json(updateUser)
})

app.delete('/users/:id', checkUserId, (request, response) => {
    const index = request.userInedx
    
    users.splice(index, 1)

    return response.status(204).json()
})

app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`)
})