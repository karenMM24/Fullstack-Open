const _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {

  if(blogs.length === 0){
    return 0
  }

  const likes = blogs.map(blog => blog.likes)

  const sum = likes.reduce(
    (acum, current) => acum + current,
  )

  return blogs.length === 0
    ? 0
    : sum
}

const favoriteBlog = (blogs) => {

  if(blogs.length === 0){
    return null
  }

  let favorite = blogs[0]

  blogs.forEach((blog) => {
    if(blog.likes > favorite.likes){
      favorite = blog
    }
  })

  return favorite
}

const mostBlogs = (blogs) => {

  if(blogs.length === 0){
    return null
  }

  const authorCount =  _.countBy(blogs, 'author')

  const blogsList = Object.entries(authorCount).map(input => {
    const name = input[0]
    const qty = input[1]

    return{
      author: name,
      blogs: qty
    }
  })

  return _.maxBy(blogsList, 'blogs')
}

const mostLikes = (blogs) => {

  if(blogs.length === 0){
    return null
  }

  const authorBlogs = _.groupBy(blogs, 'author')

  const likesList = Object.entries(authorBlogs).map(input => {
    const name = input[0]
    const likes = _.sumBy(input[1], 'likes')

    return{
      author: name,
      likes: likes
    }
  })

  return _.maxBy(likesList, 'likes')
}



module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }