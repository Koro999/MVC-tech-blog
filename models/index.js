const User = require('./User')
const Post = require('./Post');
const Comment = require('./Comment');

//Model Associations 
//User has many posts
User.hasMany(Post, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});
//User has many comments
User.hasMany(Comment, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
  });
//Posts have many comments
Post.hasMany(Comment, {
    foreignKey: 'post_id',
    onDelete: 'CASCADE'
})
//Posts belong to one User
Post.belongsTo(User, {
    foreignKey: 'user_id'
})
//Comments belong to one User
Comment.belongsTo(User, {
    foreignKey: 'user_id'
})
//Comments belong to one Post
Comment.belongsTo(Post, {
    foreignKey: 'user_id'
})

module.exports = { User, Post, Comment };