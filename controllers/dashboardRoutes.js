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


//new post button
router.get('/new', withAuth, (req, res) => {
  // what view should we send the client when they want to create a new-post? (change this next line) - DONE!
  res.render('new-post', {
    // render using the dashboard partial
    layout: 'dashboard',
  });
});

//click on post 
router.get('/edit/:id', withAuth, async (req, res) => {
  try {
    //grab the post data by primary key, grab id of the post 
    const postData = await Post.findByPk(req.params.id);

    //if post truthy
    if (postData) {
      // serialize the data 
      const post = postData.get({ plain: true });
      //render using the dashboard partial
      res.render('edit-post', {
        layout: 'dashboard',
        post
      });
    } else {
      res.status(404).end();
    }
  } catch (err) {
    res.redirect('login');
  }
});

module.exports = router;