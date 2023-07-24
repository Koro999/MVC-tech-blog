const router = require('express').Router();
const { Post, Comment, User } = require('../models/');
const withAuth = require('../utils/auth');

// Grab all posts by the user logged in 
router.get('/', withAuth, async (req, res) => {
  try {
    // find by primary key, use current session users, user_id
    // exclude pw fields
    // include posts, from post model
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post }],
    });

    //grab all postData
    const postData = await Post.findAll({
      where:{
        //from the user with matching session user id
        user_id: req.session.user_id,
      },
      include: [
        {
          //grab from Comment model and include corresponding name from the user model
          model: Comment,
          include: {
            model: User,
            attributes: ['name'],
          }
        },
        {
          //grab from User model, name
          model: User,
          attributes: ['name'],
        }
      ],
    });
    // serialize data for template
    const user = userData.get({ plain: true });
    const posts = postData.map((post) => post.get({ plain: true }));
    
    // fill in the view to be rendered -DONE!
    res.render('all-posts', {
      // specify a different layout
      layout: 'dashboard',
      ...user,
      posts,
      logged_in: true
    });
  } catch (err) {
    res.redirect('login');
  }
});


// AFTER CLICK ON NEW POST BUTTON
router.get('/new', withAuth, (req, res) => {
  // what view should we send the client when they want to create a new-post? (change this next line) - DONE!
  res.render('new-post', {
    // again, rendering with a different layout than main! no change needed
    layout: 'dashboard',
  });
});

// WHEN WE CLICK ON THE POST ITSELF
router.get('/edit/:id', withAuth, async (req, res) => {
  try {
    // what should we pass here? we need to get some data passed via the request body -DONE!
    const postData = await Post.findByPk(req.params.id);

    if (postData) {
      // serializing the data
      const post = postData.get({ plain: true });
      // which view should we render if we want to edit a post?
      res.render('edit-post', {
        layout: 'dashboard',
        post,
      });
    } else {
      res.status(404).end();
    }
  } catch (err) {
    res.redirect('login');
  }
});

module.exports = router;