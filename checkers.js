var checkers = (function() {
    var ROWS = 8,
        COLS = 8,
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
        var $board = $('#gameboard'),
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
		var selectedMarker,
			startingTile;

		$('.marker').click(function(e) {
			selectedMarker = this;
			startingTile = $(this).parent();
			startingTile.toggleClass('selected-tile');
			e.stopPropagation();

		});

		$('.tile').click(function() {
			if (selectedMarker && validMove(selectedMarker, this)) {
				$(selectedMarker).appendTo(this);
				startingTile.removeClass('selected-tile');
				var position = $(this).data('position');
				updateBoard(selectedMarker, position);
			}
		});
    }

    var validMove = function(selectedMarker, tile) {
    	var startingPosition = $(selectedMarker).parent().data('position');
    	var position = $(tile).data('position');
    	var validPosition;


    	if ($(selectedMarker).hasClass('red')) {
    		validPosition = startingPosition - 9 === position || startingPosition - 7 === position;
    	} else if ($(selectedMarker).hasClass('black')) {
    		validPosition = startingPosition + 9 === position || startingPosition + 7 === position;
    	}

    	return $(tile).hasClass('red') && validPosition;
    }
    
    var positionNumber = function(map) {
    	return map[0] * COLS + map[1];
    }

    var init = function() {
        createBoard();
        placePieces();
    }

    var play = function() {
        init();
        move();
    }

    return {
        play: play
    }

})();

$(document).ready(function() {
    checkers.play();
});