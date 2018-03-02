const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')
const { getUserId } = require('./utils')
// const { GraphQLServer } = require('graphql-yoga')
const { importSchema } = require('graphql-import')
// const { Prisma } = require('prisma-binding')
const { me, signup, login, updatePassword, AuthPayload } = require('./auth')
const { user } = require('./users')



async function drafts(parent, args, ctx, info) {
  const userId = getUserId(ctx)
  if (!userId) {
    throw new Error('You must be authenticated to view the posts.')
  }
  return ctx.db.query.posts({ where: { isPublished: false } }, info)
}


const resolvers = {
  Query: {
    me,
    user,
    feed (parent, args, ctx, info) {
      return ctx.db.query.posts({ where: { isPublished: true } }, info)
    },
    drafts,
    post (parent, { id }, ctx, info) {
      return ctx.db.query.post({ where: { id: id } }, info)
    },
  },
  Mutation: {
    signup,
    login,
    updatePassword,
    createDraft(parent, { title, text }, ctx, info) {
      return ctx.db.mutation.createPost(
        { data: { title, text, isPublished: false } },
        info,
      )
    },
    deletePost(parent, { id }, ctx, info) {
      return ctx.db.mutation.deletePost({where: { id } }, info)
    },
    publish(parent, { id }, ctx, info) {
      return ctx.db.mutation.updatePost(
        {
          where: { id },
          data: { isPublished: true },
        },
        info,
      )
    },
  },
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'http://localhost:4466/my-app/dev',
      secret: 'mysecret123',
      debug: true,
    }),
  }),
})

server.start(() => console.log('Server is running on http://localhost:4000'))
