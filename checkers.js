var checkers = (function() {
    var ROWS = 8,
        COLS = 8,
        playerTurn = {
        	count: 0,
        	red: true
        },
        map = [ [2,0,2,0,2,0,2,0],
        		[0,2,0,2,0,2,0,2],
        		[2,0,2,0,2,0,2,0],
        		[0,0,0,0,0,0,0,0],
        		[0,0,0,0,0,0,0,0],
        		[0,1,0,1,0,1,0,1],
        		[1,0,1,0,1,0,1,0],
        		[0,1,0,1,0,1,0,1],
        	  ];

    var createBoard = function() {
        var $board = $('.gameboard'),
            $tile,
            $row;

        for (var row = 0; row < ROWS; row++) {
            $row = $("<div class='row'></div>")
            for (var col = 0; col < COLS; col++) { 
                var color = ((row % 2 == 0 && col % 2 == 0) || (row % 2 == 1 && col % 2 == 1)) ? 'red' : 'black';
                $tile = $("<div class='tile " + color + "'></div>"); 
                $tile.attr('data-position', positionNumber([row, col]));
                $row.append($tile);       
            }
            $board.append($row);
        }
    } 

    var placePieces = function() {
    	for (var row = 0; row < ROWS; row++) {
    		for (var col = 0; col < COLS; col++) {
    			var tilePosition = $(".tile[data-position='" + positionNumber([row, col]) + "']");
    			if (map[row][col] === 1) {
    				$("<div class='marker red'></div>").appendTo(tilePosition);
    			} else if (map[row][col] === 2) {
    				$("<div class='marker black'></div>").appendTo(tilePosition);
    			}
    		}
    	}
    }

    var positionRowCol = function(position) {
    	var row = Math.floor(position / COLS);
    	var col = position % COLS;
    	return { 
    		row: row,
    		col: col
    	};
    }

    var updateBoard = function(piece, position) {
    	var color;
    	if ($(piece).hasClass('red')) {
    		color = 1
    	} else if ($(piece).hasClass('black')) {
    		color = 2;
    	}

    	var index = positionRowCol(position);
    	map[index.row][index.col] = color;
    }

    var move = function() {
		var selectedMarker;

		$(document).click(function() {
			$('.selected-tile').removeClass('selected-tile');
			selectedMarker = undefined;
		});

		
		$('.marker').click(function(e) {
			$(selectedMarker).parent().removeClass('selected-tile');
			if ($(this).hasClass('red') && playerTurn.red) {
				selectedMarker = this;
				$(selectedMarker).parent().addClass('selected-tile');
			} else if ($(this).hasClass('black') && !playerTurn.red) {
				selectedMarker = this;
				$(selectedMarker).parent().addClass('selected-tile');
			}
			e.stopPropagation();
		});

		$('.tile').click(function() {
			if (selectedMarker) {
				if (validMove(selectedMarker, this)) {
					$(selectedMarker).appendTo(this);
					$('.selected-tile').removeClass('selected-tile');
					var position = $(this).data('position');
					updateBoard(selectedMarker, position);
					switchPlayer();
				}
				if (validAttack(selectedMarker, this)) {
					console.log("can attack");
					$(selectedMarker).appendTo(this);
					switchPlayer();
				}
			}
		});
    }

    var switchPlayer = function() {
    	playerTurn.count++;
		playerTurn.red = (playerTurn.count % 2 == 0) ? true : false;
		displayMessage("<div class='" + ((playerTurn.red) ? "redfont" : "blackfont") + "'>" 
			+ ((playerTurn.red) ? "Red's" : "Black's") + " turn.</div>");
    }

    var validAttack = function(selectedMarker, tile) {
    	var initialPosition = $(selectedMarker).parent().data('position');
    	var targetPosition = $(tile).data('position');
    	var oppenentMarker;
    	var validPosition = false;

    	if ($(selectedMarker).hasClass('red')) {
    		if (initialPosition - (9 * 2) === targetPosition || initialPosition - (7 * 2) === targetPosition) {
    			if ($(".tile[data-position='" + (initialPosition - 9) + "']").find('.marker.black').length) {
    				$(".tile[data-position='" + (initialPosition - 9) + "']").children().removeClass('marker');
    				validPosition = true;
    			}
    			if ($(".tile[data-position='" + (initialPosition - 7) + "']").find('.marker.black').length) {
    				$(".tile[data-position='" + (initialPosition - 7) + "']").children().removeClass('marker');
    				validPosition = true;
    			}
    		}
    		
    	} else if ($(selectedMarker).hasClass('black')) {
    		if (initialPosition + (9 * 2) === targetPosition || initialPosition + (7 * 2) === targetPosition) {
    			if ($(".tile[data-position='" + (initialPosition + 9) + "']").find('.marker.red').length) {
    				$(".tile[data-position='" + (initialPosition + 9) + "']").children().removeClass('marker');
    				validPosition = true;
    			}
    			if ($(".tile[data-position='" + (initialPosition + 7) + "']").find('.marker.red').length) {
    				$(".tile[data-position='" + (initialPosition + 7) + "']").children().removeClass('marker');
    				validPosition = true;
    			}
    		}
    	}

    	return $(tile).hasClass('red') && $(tile).find('.marker').length === 0 && validPosition;
    }

    var validMove = function(selectedMarker, tile) {
    	var initialPosition = $(selectedMarker).parent().data('position');
    	var targetPosition = $(tile).data('position');
    	var validPosition = false;

    	if ($(selectedMarker).hasClass('red') && playerTurn.red) {
    		validPosition = initialPosition - 9 === targetPosition || initialPosition - 7 === targetPosition;
    	} else if ($(selectedMarker).hasClass('black') && !playerTurn.red) {
    		validPosition = initialPosition + 9 === targetPosition || initialPosition + 7 === targetPosition;
    	}

    	return $(tile).hasClass('red') && $(tile).find('.marker').length === 0 && validPosition;
    }

    var displayMessage = function(element) {
    	$('.message').html(element);
    }

    var gameWon = function() {
    	var playerOneLeft = false, playerTwoLeft = false;
    	for (var row = 0; row < ROWS; row++) {
    		for (var col = 0; col < COLS; col++) {
    			if (map[row][col] === 1) {
    				playerOneLeft = true;
    			}
    			if (map[row][col] === 2) {
    				playerTwoLeft = true;
    			}
    		}
    	}
    	console.log('gameWon function finished');
    	return !(playerOneLeft && playerTwoLeft);
    }
    
    var positionNumber = function(map) {
    	return map[0] * COLS + map[1];
    }

    var init = function() {
        createBoard();
        placePieces();
    }

    var play = function() {
    	displayMessage("<div class='redfont'>Red's turn.</div>");
		move();
    }

    return {
        init: init,
        play: play
    }

})();

$(document).ready(function() {
    checkers.init();
    checkers.play();
});