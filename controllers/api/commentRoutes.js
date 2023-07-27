const router = require('express').Router();
const { Comment } = require('../../models/');
const withAuth = require('../../utils/auth');

//get comment
router.get('/', async (req, res) => {
  try{
    const commentData = await Comment.findAll();
    // serialize the data
    const comments = commentData.get({ plain: true });
    res.json(comments);
  } catch(err) {
    res.status(500).json(err);
  }
});

//post comment
router.post('/', withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    console.log(newComment.dataValues)
    res.status(200).json(newComment);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;