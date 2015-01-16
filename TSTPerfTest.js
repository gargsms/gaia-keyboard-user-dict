var Node = function() {
  function Node(character, is_word_end) {
    var self = this;
    self.character = character;
    self.left_node = null;
    self.right_node = null;
    self.center_node = null;
    self.is_word_end = is_word_end;
    self.frequency = 0;
    return self;
  };
  Node.prototype = {
    set_word_end: function() {
      var self = this;
      self.is_word_end = true;
    },
    left: function(node) {
      var self = this;
      if (node != undefined && node != null) {
        self.left_node = node;
      }
      return self.left_node;
    },
    right: function(node) {
      var self = this;
      if (node != undefined && node != null) {
        self.right_node = node;
      }
      return self.right_node;
    },
    center: function(node) {
      var self = this;
      if (node != undefined && node != null) {
        self.center_node = node;
      }
      return self.center_node;
    },
    set_frequency: function(frequency) {
      var self = this;
      self.frequency = frequency;
    }
  };
  return Node;
}();


var TernaryTree = function() {
  function TernaryTree() {
    var self = this;
    self.root = null;
    // maxFrequency helps us in normalizing the weights within 0-31
    self.maxFrequency = 0;
    return self;
  };
  TernaryTree.prototype = {
    _add: function(word, position, node_accessor, frequency) {
      var self = this;
      var node = node_accessor();
      if (node == null) {
        node = new Node(word[position], false);
        node_accessor(node);
      }
      var char = node.character;
      if (word[position] < char) {
        self._add(word, position, function(n) { 
                                  return node.left(n); }, frequency);
      } else if (word[position] > char) {
        self._add(word, position, function(n) { 
                                  return node.right(n); }, frequency);
      } else {
        if (position == (word.length - 1)) {
          node.set_word_end();
          /* node.is_word_end = true;*/
          /* use this frequency value to weigh suggestions*/
          node.set_frequency(frequency);
        } else {
          self._add(word, position + 1, 
            function(n) { return node.center(n); }, frequency);
          }
      }
    },

    add: function(word, frequency) {
      /* add a string to the tree */
      if(word == null || word == "")
        return;
      var self = this;
      var node_accessor = function(node) {
        if (node != undefined && node != null)
          self.root = node;
        return self.root;
      };
      self._add(word, 0, node_accessor, frequency);
      self._set_max_frequency(frequency);
      return self;
    },
      
    _all_possible_suffixes: function(node, current_prefix) {
      var self = this;
      if (node == null || node == undefined)
        return [];
      var char = node.character;
      if (current_prefix == undefined || current_prefix == null)
        current_prefix = "";
      var result = [];
      var right_suffixes = [], left_suffixes = [], center_suffixes = [];
      if (node.right() != null) {
        right_suffixes = self._all_possible_suffixes(node.right(), current_prefix);
      }
      if (node.left() != null) {
        left_suffixes = self._all_possible_suffixes(node.left(), current_prefix);
      }
      var new_prefix = current_prefix + node.character;
      if (node.is_word_end) {
        result.push([new_prefix, node.frequency]);
      }
      if (node.center() != null) {
        center_suffixes = self._all_possible_suffixes(node.center(), new_prefix);
      }
      // save from the recursive death
      // decide whether to concat or push
      if(right_suffixes.length) {
        if(typeof right_suffixes[0] === "object") {
          result = result.concat(right_suffixes);
        }
        else {
          result.push(right_suffixes);
        }
      }
      if(left_suffixes.length) {
        if(typeof left_suffixes[0] === "object") {
          result = result.concat(left_suffixes);
        }
        else {
          result.push(left_suffixes);
        }
      }
      if(center_suffixes.length) {
        if(typeof center_suffixes[0] === "object") {
          result = result.concat(center_suffixes);
        }
        else {
          result.push(center_suffixes);
        }
      }
      return result;
    },
      
    search: function(prefix) {
      if(!prefix.length)
        return '';
      var self = this;
      var result = [];
      var word = prefix;
      var last_character_in_word = (word == "") ? 0 : (word.length - 1);
      var node = self.root;
      var position = 0;
      while (node != null) {
        if (word[position] < node.character)
          node = node.left();
        else if (word[position] > node.character)
          node = node.right();
        else {
          if (position == last_character_in_word) { /* end */
            result = self._all_possible_suffixes(node.center(), prefix);
            if (node.is_word_end)
              result.push([prefix, node.frequency]);
            break;
          }
          node = node.center();
          position = position + 1;
        }
      }
      
      // Sort the result array according to the frequencies
      var temp = {},
          freqs = [];
      for(var _i = 0, _len = result.length; _i < _len; _i++) {
        temp[result[_i][1]] = temp[result[_i][1]] || [];
        temp[result[_i][1]].push(result[_i][0]);
        freqs.push(result[_i][1]);
      }
      freqs.sort(function(a, b) {
        return a - b;
      });
      freqs.reverse();
      result = [];
      for(var _i = 0, _len = freqs.length; _i < _len; _i++) {
        var match = temp[freqs[_i]];
        temp[freqs[_i]] = []; // Remove duplicates matches
        match.forEach(function(e) {
          result.push([e, freqs[_i]]);
        });
      }

      return result;
    },

    _set_max_frequency: function(frequency) {
      var self = this;
      if(self.maxFrequency < frequency) {
        self.maxFrequency = frequency;
      }
    }
  };
  return TernaryTree;
}();

var tree = new TernaryTree();

// Replace this with the proper array
var arr = [];
// Or you can use the weightedStringGenerator and read the output here

function populate() {
  var now = Date.now();

  for(var i = 0, len = arr.length; i < len; i++) {
    tree.add(arr[i][0], arr[i][1]);
  }

  return Date.now() - now;
}

function search(input) {
  var now = Date.now();

  console.log(tree.search(input));

  return Date.now() - now;
}

module.exports.populate = populate;
module.exports.search = search;