const router = require("express").Router();
const { Post, Comment, User } = require("../models");
const withAuth = require("../utils/auth");

//Get all posts and JOIN with user data
router.get("/", async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ]
    });
    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render("homepage", {
      posts,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//grab posts by id
router.get("/post/:id", async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    const post = postData.get({ plain: true });

    res.render("post", {
      post,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//withAuth to prevent access to route
//dashboard route
router.get("/dashboard", withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Post }],
    });

    const user = userData.get({ plain: true });

    res.render("dashboard", {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
/*
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
});*/

//login route
router.get("/login", (req, res) => {
  // If the user is already logged in use another route
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }
  res.render("login");
});

//signup route
router.get("/signup", (req, res) => {
  // If the user is already logged in use another route
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }
  res.render("signup");
});

module.exports = router;
