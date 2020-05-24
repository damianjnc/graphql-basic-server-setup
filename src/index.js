const { ApolloServer, gql } = require('apollo-server')

const typeDefs = gql`
  type Query {
    hello(name: String!): String!
    user: User!
  }

  type User {
    id: ID!
    username: String
    firstLetterOfUserName: String
  }

  type Error {
    field: String!
    message: String!
  }

  type RegisterResponse {
    errors: [Error!]!
    user: User!
  }

  input UserInfo {
    username: String
    password: String!
    age: Int
  }

  type Mutation {
    register(userInfo: UserInfo!): RegisterResponse!
    login(userInfo: UserInfo!): String!
  }
`

const resolvers = {
  User: {
    username: parent => {
      console.log('parenta', parent)
      return parent.username
    },
    firstLetterOfUserName: parent => {
      return parent.username ? parent.username[0] : null
    }
  },
  Query: {
    hello: (__, { name }) => name,
    user: () => ({
      id: 1,
      username: 'username from query'
    })
  },

  Mutation: {
    login: (parent, { userInfo: { username } }, context, info) => {
      console.log(context)
      return username
    },
    register: (__, args) => ({
      errors: [{ field: 'field', message: 'message' }],
      user: {
        id: 1,
        username: null
      }
    })
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: (req, res) => ({ req, res })
})

server.listen().then(({ url }) => console.log(`server started at ${url}`))
