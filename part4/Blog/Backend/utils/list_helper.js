const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {

    const likes = blogs.map(blog => blog.likes)

    const sum = likes.reduce(
        (acum, current) => acum + current,
    )

    return blogs.length === 0
      ? 0
      : sum
}

module.exports = { dummy, totalLikes }