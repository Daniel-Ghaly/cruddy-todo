const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

// Refactor: EACH NEW TODO ENTRY MUST BE SAVED IN IT'S OWN FILE
exports.create = (text, callback) => {
  // Use id here to create a file path inside dataDir (will be created if it doesn't exist)
  counter.getNextUniqueId((error, id) => {
    // debugger;
    // var path = `${exports.dataDir}/${id}.txt`;
    // fs.writeFile([file], [data], [options], [callback]) <= Params
    if (error) {
      console.log('error');
    } else {
      var path = exports.dataDir + '/' + id + '.txt';
      fs.writeFile(path, text, (error) => {
        if (error) {
          console.log('error');
          return;
        } else {
          // console.log('file written successfully', counterString, text);
          callback(null, { id, text });
          // debugger;
        }
      });
    }
  });

  // Each time a POST is made to the collection route, save a file with the todo item in the dataDir folder
  // ONLY SAVE THE TODO TEXTIN THE FILE, the id is encoded into its filename
  // DO NOT STORE AN OBJECT

  // Verify by checking:
  // the value that is saved in counter.txt increases with each new todo item created
  // The number of files in dataDir directory increases each time a new todo is created
  // The contents of each file contain ONLY THE TEXT of that todo item  (remember, we aren't storing objects)
};
//[] commit: "Complete creating ToDos"


// Refactor: RETURN ARRAY OF TODOS TO CLIENT APP WHENEVER A GET REQUEST TO THE COLLECTION ROUTE OCCURS
exports.readAll = (callback) => {
  // read dataDir directory and build a list of files. The id of each todo is encoded in its filename
  var data = _.map(items, (text, id) => {
    return { id, text };
  });
  callback(null, data);

  /**
   * Do not attempt to read the contents of each file that contains the todo item text. This will send
   * you down a rabbit hole.
   *
   * Not: you must still include a text field in response to the client, it's recommended that you use
   * the message's id (from the filename) for both the id field and the text field. It will have the
   * effect of changing the presentation of your todo items for the time being.
   */

  //fs.readFile([path], [callback])
};
// [] commit "Complete retrieving all todos"

// Refactor: READ A TODO ITEM FROM THE dataDir BASED ON THE MESSAGE'S ID
exports.readOne = (id, callback) => {
  // Must read teh contents of the todo item file and respond with it to the client
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }

  // Will be correct when you click edit on the UI, you'll see the todo text in the popup window
};
// [] commit "Complete retrieving one todo"

// Refactor: REWRITE THE TODO ITEM STORED IN THE dataDir BASED ON IT'S id
exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }

  // Will be correct when you're able to save the edited todo item and
  // upon subsequent clicks of the edit button, the changes will persist
  // Should also confirm the counter isn't changing between updates.
  // Refreshing the page should also show the updated todo
};
// [] commit "Complete updating todo"

// Refactor: REMOVE THE TODO FILE STORED IN dataDir BASED ON GIVEN id
exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
  // Will be correct when you refresh the page, the delete todo item will not
  // be present
};
// [] commit "Complete deleting a todo"

// Learn about promises by completing the BMR in Promises course on Learn. Then come back and complete readAll refactor (below)I

// Now go finish fixing readAll (back at the top)
// 1. Find the test for readAll and refactor to expect the correct todo text instead of the id
// 2. Refactor the actual readAll function. Each todo entry is stored in it's own file, so
// we'll end up with many async operations (n files = n operations). These all need to complete
// before you can respond to the API request. This is a significant challenge, look up promises and
// see how they can help.

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
