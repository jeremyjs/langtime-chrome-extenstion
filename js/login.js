
$(function() {
  $('.signup-link').click(function(e) {
    $('.nav-tabs > li').removeClass('active');
    $(this).addClass('active');
    $('form.login').hide();
    $('form.signup').show();
    synchronize('.login', '.signup');
  });
  $('.login-link').click(function(e) {
    $('.nav-tabs > li').removeClass('active');
    $(this).addClass('active');
    $('form.signup').hide();
    $('form.login').show();
    synchronize('.signup', '.login');
  });
  $('form.login button.login').click(function(e) {
    e.preventDefault();
    var email = $('.login .email').val();
    var password = $('.login .password').val();
    fb.users.authWithPassword({
      email    : email,
      password : password
    }, function(error, user) {
      if (error === null) {
        console.log("User ID: " + user.uid + ", Provider: " + user.provider);
        window.location.href = '/';
      } else {
        console.log("Error authenticating user:", error);
        $('.notice').html(error);
      }
    });
  });
  $('form.signup button.signup').click(function(e) {
    e.preventDefault();
    // create a new user
    var name = $('.signup .name').val();
    var email = $('.signup .email').val();
    var password = $('.signup .password').val();
    var isTeacher = !!$('.signup .teacher').is(':checked');
    if(!password) {
      $('.notice').html('Password is a required field');
      return;
    }
    fb.users.createUser({
      email    : email,
      password : password
    }, function(error) {
      if (error === null) {
        fb.users.authWithPassword({
          email    : email,
          password : password
        }, function(error, user) {
          if (error) {
            console.log("Error authenticating user:", error);
            return;
          }
          // user authenticated with Firebase
          console.log("User ID: " + user.uid + ", Provider: " + user.provider);

          fb.users.child(user.uid).set({
            name: name,
            email: email,
            isTeacher: isTeacher
          }, function() {
            window.location.href = '/';
          });
        });
      } else {
        console.log("Error authenticating user:", error);
        $('.notice').html(error);
      }
    });
  });
});

function synchronize(src, dest) {
  var $src = $('form' + src);
  var email = $src.find('input.email').val();
  var password = $src.find('input.password').val();
  var $dest = $('form' + dest);
  $dest.find('input.email').val(email);
  $dest.find('input.password').val(password);
};
