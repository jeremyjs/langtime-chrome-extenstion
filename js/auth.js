
window.getStudentId = function() {
  return window.currentUser.isTeacher ? window.currentUser.currentStudent : window.currentUser.uid;
};

window.getSessionId = window.getStudentId;

function onAuth(success, failure) {
  if(window.currentUser) {
    success();
    return;
  }

  // TODO: why does this get run like four times on page load? mutex?
  var user = fb.langtime.getAuth();
  if (user) {
    fb.users.child(user.uid).once('value', function(snapshot) {
      if(snapshot) {
        var user = snapshot.val();
        user.uid = snapshot.key();
        window.currentUser = user
        console.log('Authenticated user:', user);
        success();
      } else {
        console.log('user not found for uid: ' + user.uid);
        failure();
      }
    });
  } else {
    failure();
  }
};

console.log(window.location.pathname)

if(window.location.pathname !== '/login.html') {
  onAuth(function success() {
    if(window.location.pathname === '/') {
      if(!window.currentUser.isTeacher) {
        window.location.href = '/add_card.html';
      }
    }
  }, function failure() {
    window.location.href = '/login.html';
  });
}
