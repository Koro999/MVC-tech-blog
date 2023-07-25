const router = require("express").Router();
const { Post, Comment, User } = require("../models");
const withAuth = require("../utils/auth");

//Get all posts and JOIN with user data
router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
        {
          model: Comment,
          include: {
            model: User,
            attributes: ['name'],
          },
        },
      ],
      order: [
        ['date_created', 'DESC'],
      ]
});

    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', {
      posts,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//grab posts by id
router.get('/post/:id', withAuth, async (req, res) => {
  try {
    //const pageTitle = 'Posts';
    const postData = await Post.findOne({
      where: {
        id: req.params.id
      },
      include: [
        User,
        {
          model: Comment,
          include: [User],
        },
      ],
      order: [
        ['date_created', 'DESC'],
      ]
    });

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


//login route
router.get("/login", (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }

  res.render("login");
});

//signup route
router.get("/signup", (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }
  res.render('signup')
});

module.exports = router;
