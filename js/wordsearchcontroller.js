"use strict";

/** This object sets up the word search game, as well as button functions (for solving
 * and for refreshing/setting up a new game).
 *
 * @author Noor Aftab
 *
 * @param {String} gameId ID of the word search game div (where the actual grid of letters goes)
 * @param {String} listId ID of the div where the list of words to find goes
 * @param {String} solveId ID for button to solve the puzzle
 * @param {String} newGameId ID for button to start a new game
 * @param {String} instructionsId ID for the h2 heading (to allow us to update it's text with ease)
 * @param {String} themeId ID for part of the h3 heading (to show the theme of the word search)
 */

function WordSearchController(gameId, listId, solveId, newGameId, instructionsId, themeId) {

	// an object containing various themes/words for the game
	// var searchTypes = {

	// 	"Math! (please don't run away)": [["asymptote", "differential", "algorithm", "boolean", "bob", "toad", "fart", "yes"],
	// 		// ["euclidean", "integral", "logarithm", "matrix"],
	// 		// ["riemann", "polyhedron", "theta", "vector"],
	// 		// ["binomial", "pythagoras", "eccentricity", "unit circle"],
	// 		// ["derivative",  "polar coordinates",  "tangent", "scalene"]
  //     ],
	// };

  // Extract search parameters from the URL
  var urlParams = new URLSearchParams(window.location.search);
  var theme = urlParams.get('theme');
  var wordList = urlParams.get('word_list');

  // Parse the word list into a 2D array
  var wordArray = wordList ? JSON.parse(wordList) : [];

  // Create the JSON object
  var searchTypes = {};
  searchTypes[theme] = [wordArray];

	//variables to store game logic and it's view
	var game;
	var view;

	//instructions to display in h2 header
	var mainInstructions = "Search for the list of words inside the box and click-and-drag to select them!";

	//function call to start the word search game
	setUpWordSearch();

	/** randomly chooses a word theme and sets up the game matrix and the game
	 * view to reflect that theme
	 */
	function setUpWordSearch() {

		//generates a random theme
		var searchTypesArray = Object.keys(searchTypes); //converts theme object to array
		var randIndex = Math.floor(Math.random()*searchTypesArray.length); //generates random number/index
		var listOfWords = searchTypes[searchTypesArray[randIndex]]; //retrieves the matrix of words from random index

    // // Create a deep copy of the nested array
    // var listOfWords = searchTypes[searchTypesArray[randIndex]].map(function(innerArray) {
    //   return innerArray.slice();
    // });

		//converts letters to uppercase
		listOfWords = convertToUpperCase(listOfWords);

		//sets the headings to reflect the instructions and themes
		updateHeadings(mainInstructions, searchTypesArray[randIndex]);

		//runs the logic of the game using a close of the word list (to avoid the actual object being altered)
		game = new WordSearchLogic(listOfWords.slice(), 10);
		game.setUpGame();

		//generates the view of the game and sets up mouse events for clicking and dragging
		view = new WordSearchView(game.getMatrix(), game.getListOfWords(), gameId, listId, instructionsId);
		view.setUpView();
		view.triggerMouseDrag();

	}

	/** converts a given 2D array of words to all uppercase
	 *
	 * @param {String[][]} wordList a matrix of words to convert to uppercase
	 */
  function convertToUpperCase(wordList) {
      var upperCasedList = [];

      for (var i = 0; i < wordList.length; i++) {
          var upperCasedSubList = [];

          for (var j = 0; j < wordList[i].length; j++) {
              upperCasedSubList.push(wordList[i][j].toUpperCase());
          }

          upperCasedList.push(upperCasedSubList);
      }

      return upperCasedList;
  }

	/** updates the instructions (h2) and theme (h3) headings according to the given
	 * text parameters
	 *
	 * @param {String} instructions text to set the h2 heading to
	 * @param {String} theme text to set the h3 theme element to
	 */
	function updateHeadings(instructions, theme) {

		$(instructionsId).text(instructions);
		$(themeId).text(theme);

	}

	/** solves the word search puzzle when the solve button is clicked
	 *
	 * @event WordSearchController#click
	 * @param {function} function to execute on mouse click
	 */
	$(solveId).click(function() {

		view.solve(game.getWordLocations(), game.getMatrix());

	});

	/** empties the game and list divs and replaces them with a new setup, modelling
	 * a 'refresh' effect when button is clicked
	 *
	 * @param {function} function to execute on mouse click to generate a new puzzle
	 */
	$(newGameId).click(function() {

		//empties the game and list elements, as well as the h3 theme span element
		$(gameId).empty();
		$(listId).empty();
		$(themeId).empty();

		//calls the set up to create a new word search game
		setUpWordSearch();

	})

}