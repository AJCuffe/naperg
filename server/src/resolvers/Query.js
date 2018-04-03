const {forwardTo} = require('prisma-binding')
const {getUserId} = require('../utils')
const {importSchema} = require('graphql-import')
const {me, signup, login, updatePassword, AuthPayload} = require('./auth')
const {user} = require('../users')
const {request} = require('graphql-request')


async function singleUser(parent, {
  id
}, ctx, info) {
  return ctx.db.query.user({
    where: {
      id
    }
  }, info)
  // const userId = getUserId(ctx)
  // const requestingUserIsAuthor = await ctx.db.exists.User({
  //   id,
  // })
  // const requestingUserIsAdmin = await ctx.db.exists.User({
  //   id: userId,
  //   role: 'ADMIN',
  // })
  //
  // if (requestingUserIsAdmin || requestingUserIsAuthor) {
  //   return ctx.db.query.user({ where: { id } }, info)
  // }
  // throw new Error(
  //   'Invalid permissions, you must be an admin or the author of this post to retrieve it.',
  // )

}

async function users(parent, args, ctx, info) {
  return ctx.db.query.users({}, info)
}

async function feed(parent, args, ctx, info) {
  return ctx.db.query.posts({
    where: {
      isPublished: true
    }
  }, info)
}
async function drafts(parent, {
  skip
}, ctx, info) {
  // console.log(skip)
  const id = getUserId(ctx)

  const where = {
    isPublished: false,
    author: {
      id
    }
  }

  return ctx.db.query.posts({
    where
  }, info)
}

async function post(parent, {
  id
}, ctx, info) {
  const userId = getUserId(ctx)
  const requestingUserIsAuthor = await ctx.db.exists.Post({
    id,
    author: {
      id: userId
    }
  })
  const requestingUserIsAdmin = await ctx.db.exists.User({id: userId, role: 'ADMIN'})

  if (requestingUserIsAdmin || requestingUserIsAuthor) {
    return ctx.db.query.post({
      where: {
        id
      }
    }, info)
  }
  throw new Error('Invalid permissions, you must be an admin or the author of this post to retrieve it.',)

}
const Query = {
  me,
  singleUser,
  users,
  feed,
  drafts,
  post,
  cars: forwardTo('db')
}

module.exports = {
  Query
}
