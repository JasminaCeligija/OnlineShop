const Product = require('../models/product');
const User = require('../models/user');
const fs = require("fs");

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated: req.session.isLoggedIn, 
    role: req.session.userRole
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const quantity = req.body.quantity; 
  const criticalQuantity = req.body.criticalQuantity;
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user, 
    quantity: quantity, 
    criticalQuantity: criticalQuantity
  });
  product
    .save()
    .then(result => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};


var allOrders = [];
exports.getUserDetails = (req, res, next) => {

const userId = req.params.userId;
User.findById(userId)
  .then(user => {
    if (!user) {
      return res.redirect('/'); 
    }
    
    fs.readFile('./signup.json', function (err, data) {
      if(err)
      console.log(err);
     
      var signedUpUsers = JSON.parse(data);
     
      signedUpUsers.forEach(function (signedUpUser) {
        if(signedUpUser.User == user.email) {

          fs.readFile('./orders.json', function (err, ordersArray) {
            if(err)
            console.log(err);
            var orders = JSON.parse(ordersArray);

            orders.forEach(function (order) {
              if(order.User == user.email) {
                allOrders.push(order);
              }
                  
              
        });
        })
        res.render('admin/user-details', {
          pageTitle: 'User Details',
          path: '/admin/user-details',
          user: user,
          isAuthenticated: req.session.isLoggedIn, 
          role: req.session.userRole, 
          signedUpUser: signedUpUser, 
          orders: allOrders
        });


        }
  });
  })


  })
  .catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        isAuthenticated: req.session.isLoggedIn, 
        role: req.session.userRole
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const updatedQuantity = req.body.quantity;
  const updatedCriticalQuantity = req.body.criticalQuantity;

  Product.findById(prodId)
    .then(product => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      product.quantity = updatedQuantity;
      product.criticalQuantity = updatedCriticalQuantity;

      return product.save();
    })
    .then(result => {
      console.log('UPDATED PRODUCT!');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find()
     //.select('title price -_id')
    // .populate('userId', 'name')
    .then(products => {
      console.log(products);
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        isAuthenticated: req.session.isLoggedIn, 
        role: req.session.userRole
      });
    })
    .catch(err => console.log(err));
};

exports.getUsers = (req, res, next) => {
  User.find()
     //.select('title price -_id')
    // .populate('userId', 'name')
    .then(users => {
      console.log(users);
      res.render('admin/usermanagment', {
        users: users,
        pageTitle: 'User Managment',
        path: '/admin/usermanagment',
        isAuthenticated: req.session.isLoggedIn, 
        role: req.session.userRole
      });
    })
    .catch(err => console.log(err));
};


exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
