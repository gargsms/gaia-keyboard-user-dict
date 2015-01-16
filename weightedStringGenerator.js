var r = '';

function asdf() {
  var s = 'qwertyuiopasdfghjklzxcvbnm';
  
  var now = Date.now();
  
  for(var i = 0; i < 5000; i++) {
    var str = '',
      a = Math.ceil(Math.random() * 26),
      b = Math.floor(Math.random() * 26),
      c = Math.ceil(Math.random() * 10);
    if(a > b) {
        str = s.substring(a, b);
    }
    else {
      str = s.substring(b, a);
    }

    r += "['" + str + "', " + c + "]";
  }

  return Date.now() - now;
}

// Replace a by the filename you want to use
fs.writeFile('a', r);