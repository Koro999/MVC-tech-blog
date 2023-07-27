const router = require('express').Router();
const { Post } = require('../../models/');
const withAuth = require('../../utils/auth');

// Update post 
//don't forget the backslash to make sure the route is absolute 
router.put('/:id', withAuth, async (req, res) => {
    try {
      const postData = await Post.update(req.body, {
        where: {
          id: req.params.id,
        },
      });
  
      if (!postData) {
        res.status(404).json({ message: 'No post found with that id!' });
        return;
      }
      res.status(200).json(postData);
  
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;