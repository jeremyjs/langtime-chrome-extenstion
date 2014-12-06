var langtime = new Firebase('https://langtime.firebaseio.com');
fb = {};
fb.langtime = langtime
fb.users    = langtime.child('users');
