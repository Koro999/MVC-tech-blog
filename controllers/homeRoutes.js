const router = require('express').Router();
const { Post, Comment, User } = require('../models');
const withAuth = require('../utils/auth');

//Get all projects and JOIN with user data 
router.get('/', async (req, res) => {
  try{
    // grab all information inside post model
    const postData = await Post.findAll({
      include: [
        {
          //grab name from the user model
          model: User,
          attributes: ['name'],
        },
        {
          //grab user name from the comment model
          model: Comment,
          include: {
            model: User,
            attributes: ['name'],
          },
        },
      ],
      order: [
        //arrange in order of date created, descending
        ['date_created', 'DESC'],
      ]
    });

    // Serialize data so the template can read it
    const posts = postData.map((project) => project.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      posts, 
      logged_in: req.session.logged_in 
    });
  } catch(err) {
    res.status(500).json(err)
  }
});

//grab posts by id 
router.get('/post/:id', withAuth, async (req, res) => {
  try {
    //grab one from post 
    const postData = await Post.findByPk(req.params.id, ({
      include: [
        {
          //grab from User model, include name
          model: User,
          include: ['name']
        }
      ]
    })
    );

    //check to see if postData exists, if truthy
    if (postData) {

      const post = postData.get({ plain: true });

      res.render('single-post', {
        post,
        logged_in: req.session.logged_in
      });
    } else {
      res.status(404).end();
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Project }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//login route
router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

//signup route
router.get('/signup', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }
});

module.exports = router;
