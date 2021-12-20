var board = [0, 0, 0, 0, 0, 0, 0, 0, 0, 'false']
var turn = "X"
var win = " "
var bgc = "#33ff33"
var winsets = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [1, 5, 9],
  [3, 5, 7],
  [3, 6, 9]
]
var server;
var b;
function createServer() { // CREATE SERVER
  b = new Bugout();
  $('#code').html(`Code: ${b.address()}`)
  server = 'host'
  b.register("connected", function(address, args, callback) {
    alert('A player has connected!')
    args.hello = undefined
    args.board = board;
    args.turn = turn
    callback(args);
  });
  b.register("reloadBoard", function(address, args, callback) {
    args.hello = undefined
    args.board = board;
    args.turn = turn;
    callback(args);
  });
  b.register("setHostBoard", function(address, args, callback) {
    board = args.board;
    turn = args.turn;
    if(turn) $("#result").html("It's " + turn + "'s Turn!")
    if(board[0]) $(`#1a`).html(board[0]);
    if(board[1]) $(`#2a`).html(board[1]);
    if(board[2]) $(`#3a`).html(board[2]);
    if(board[3]) $(`#4a`).html(board[3]);
    if(board[4]) $(`#5a`).html(board[4]);
    if(board[5]) $(`#6a`).html(board[5]);
    if(board[6]) $(`#7a`).html(board[6]);
    if(board[7]) $(`#8a`).html(board[7]);
    if(board[8]) $(`#9a`).html(board[8]);
  });
}

function joinServer(id) { // JOIN SERVER
  b = new Bugout(id);
  b.on("server", function(address) {
    b.rpc("connected", {
    }, function(result) {
      $('#code').html('Connected!')
      alert('Connected!')
      setInterval(reloadBoard, 700, b)
      server = 'joined'
    });
  });
}

$('#codeSubmit').click(function() { //insert code
  if ($('#codeInput').val() == '' || server !== undefined) return;
  $('#createServer').css('display', 'none')
  $('#code').html('Connecting!')
  $('#codeInputLabel').css('display', 'none')
  $('#codeInput').css('display', 'none')
  $('#codeSubmit').css('display', 'none')
  joinServer($('#codeInput').val())

})

$('#createServer').click(function() { //create server
  if(server == undefined) createServer()
  $('#createServer').css('display', 'none')
  $('#codeInputLabel').css('display', 'none')
  $('#codeInput').css('display', 'none')
  $('#codeSubmit').css('display', 'none')
})

function reloadBoard(){//reload joined board
  b.rpc("reloadBoard", {
  }, function(result) {
    board = result.board;
    if(board[9] == 'true'){ reset(); board[9] = 'false'};
    turn = result.turn;
    if(turn) $("#result").html("It's " + turn + "'s Turn!")
    if(board[0]) $(`#1a`).html(board[0]);
    if(board[1]) $(`#2a`).html(board[1]);
    if(board[2]) $(`#3a`).html(board[2]);
    if(board[3]) $(`#4a`).html(board[3]);
    if(board[4]) $(`#5a`).html(board[4]);
    if(board[5]) $(`#6a`).html(board[5]);
    if(board[6]) $(`#7a`).html(board[6]);
    if(board[7]) $(`#8a`).html(board[7]);
    if(board[8]) $(`#9a`).html(board[8]);
    winLogic()
  });
}

$(".ttbutton").click(function() {//click handler
  if(server == 'host'){
    if(turn == 'O') return;
    if (this.id.includes("a")) {
    return;
    }
    if ($(`#${this.id}a`).html() == "‏‏‎ ‎" && win == " ") {
      $(`#${this.id}a`).html(turn)
      board[this.id - 1] = turn
      turnSet()
    }  
    winLogic()
  }
  else if(server == 'joined'){
    if(turn == 'X') return;
    if ($(`#${this.id}a`).html() == "‏‏‎ ‎" && win == " ") {
      $(`#${this.id}a`).html(turn)
      board[this.id - 1] = turn
      turnSet()
    }
    winLogic()
    b.rpc("setHostBoard", {
      'board': board,
      'turn': turn
    }, function(result) {
    });
  } 
})

$("#reset").click(function() {board[9]='true'; reset('but')})

function reset(a){
  if(a == 'but'){
    if(server == 'joined'){
     return;
    } 
    for (var i = 1; i <= 9; i++) {
      $(`#${i}`).css("background-color", "black");
      $(`#${i}a`).html("‏‏‎ ‎")
    }
    board = [0, 0, 0, 0, 0, 0, 0, 0, 0, 'true']
  }
  else{ 
    for (var i = 1; i <= 9; i++) {
     $(`#${i}`).css("background-color", "black");
     $(`#${i}a`).html("‏‏‎ ‎")
    }
    board = [0, 0, 0, 0, 0, 0, 0, 0, 0, 'false']
  }
  turn = "X"
  win = " "
  $("#result").html("It's " + turn + "'s Turn!")
  $("#result").css("left", "calc(50vw - 60px)");
  b.rpc("setHostBoard", {
    'board': board
  }, function(result) {
  });
}

function winLogic() {
  for (var i = 0; i < winsets.length; i++) {
    if ($("#" + winsets[i][0] + "a").html() == "X" && $("#" + winsets[i][1] + "a").html() == "X" && $("#" + winsets[i][2] + "a").html() == "X") {

      $("#" + winsets[i][0]).css("background-color", bgc);
      $("#" + winsets[i][1]).css("background-color", bgc);
      $("#" + winsets[i][2]).css("background-color", bgc);
      winner("X")
    } else if ($("#" + winsets[i][0] + "a").html() == "O" && $("#" + winsets[i][1] + "a").html() == "O" && $("#" + winsets[i][2] + "a").html() == "O") {
      $("#" + winsets[i][0]).css("background-color", bgc);
      $("#" + winsets[i][1]).css("background-color", bgc);
      $("#" + winsets[i][2]).css("background-color", bgc);
      winner("O")
    } else if ($("#1a").html() != "‏‏‎ ‎" && $("#2a").html() != "‏‏‎ ‎" && $("#3a").html() != "‏‏‎ ‎" && $("#4a").html() != "‏‏‎ ‎" && $("#5a").html() != "‏‏‎ ‎" && $("#6a").html() != "‏‏‎ ‎" && $("#7a").html() != "‏‏‎ ‎" && $("#8a").html() != "‏‏‎ ‎" && $("#9a").html() != "‏‏‎ ‎") {
      winner("tie")
    }
  }
}

function turnSet() {
  if (turn == "X") {
    turn = "O"
  } else turn = "X"
  $("#result").html("It's " + turn + "'s Turn!")
}

function winner(x) {
  win = x
  if (x == "X") {
    $("#result").html("X Won!")
    $("#result").css("left", "calc(100vw/2 - 55px)");
  } else if (x == "O") {
    $("#result").html("O Won!")
    $("#result").css("left", "calc(100vw/2 - 50px)");
  } else if (x == "tie") {
    $("#result").html("It's a tie!")
    $("#result").css("left", "calc(100vw/2 - 55px)");
    $(`div`).css("border:", "1px solid #ff0000");
  }
}
