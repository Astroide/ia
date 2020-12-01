var dgebi /* Document.GetElementById */ = id => document.getElementById(id);
var TM = 1000;
var canvas = dgebi('tictactoe'), ctx = canvas.getContext('2d'), third = 500/3, sixth = third/2, ctrls = dgebi('ctrls'), pps = dgebi('gps');
if(!inIFrame){
  ctrls.style.display = 'block';
}
function rotate90(b){
  return [b[6], b[3], b[0], b[7], /**/b[4],/**/ b[1], b[8], b[5], b[2]];
}
// 630
// 741
// 852
function rotatePosition90(p){
  switch(p){
    case 0:
    return 6;
    case 1:
    return 3;
    case 2:
    return 0;
    case 3:
    return 7;
    case 4:
    return 4;
    case 5:
    return 1;
    case 6:
    return 8;
    case 7:
    return 5;
    case 8:
    return 2;
  }
}
function O(x, y){
  ctx.strokeStyle = 'red';
  ctx.beginPath();
  ctx.arc(x*third + sixth, y*third+sixth, 30, 0, Math.PI*2);
  ctx.stroke();
  ctx.closePath();
}
function X(x, y){
  ctx.strokeStyle = 'blue';
  ctx.beginPath();
  ctx.moveTo(x*third+sixth - 25, y*third+sixth-25);
  ctx.lineTo(x*third+sixth + 25, y*third+sixth+25);
  ctx.moveTo(x*third+sixth - 25, y*third+sixth + 25);
  ctx.lineTo(x*third+sixth + 25, y*third+sixth - 25);
  ctx.stroke();
  ctx.closePath();
}
function drawBoard(b){
  ctx.clearRect(0,0,500,500);
  ctx.strokeStyle = 'purple';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(third, 0);
  ctx.lineTo(third, 500);
  ctx.moveTo(third*2, 500);
  ctx.lineTo(third*2, 0);
  ctx.moveTo(500, third);
  ctx.lineTo(0, third);
  ctx.moveTo(0, third * 2);
  ctx.lineTo(500, third*2);
  ctx.stroke();
  ctx.closePath();
  for(var i=0;i<3;i++){
    if(b[i]==1){
      O(i, 0);
    }else if(b[i]==2){
      X(i, 0);
    }
  }
  for(var i=0;i<3;i++){
    if(b[i+3]==1){
      O(i, 1);
    }else if(b[i+3]==2){
      X(i, 1);
    }
  }
  for(var i=0;i<3;i++){
    if(b[i+6]==1){
      O(i, 2);
    }else if(b[i+6]==2){
      X(i, 2);
    }
  }
}
function array_rand(arr){
  return arr[Math.floor(Math.random()*arr.length)];
}
class Board {
  constructor(){
    this.slots = [0,0,0,
                  0,0,0,
                  0,0,0];
  }
  reset(){
    this.slots = [0,0,0,
             0,0,0,
             0,0,0];
  }
  draw(){
    drawBoard(this.slots);
  }
  valid(n){
    if(n<0 || n>8 || this.slots[n])return false;
    return true;
  }
  play(player1, player2){
    return new Promise(res=>{
    player1.start_new(1);
    player2.start_new(2);
    this.reset();
    var intt, tick = true, _this = this;
    function c(st){
      clearInterval(intt);
      //console.log('eg');
      res(st);
    } 
    var p1p, p2p;
    function p1p(){
      player1.play(_this).then(()=>{
        if(_this.ended()){
          player1.end_game('won');
          player2.end_game('lost');
          _this.draw();
          res(1);
          return;
        }
        if(_this.is_draw()){
          player1.end_game('draw');
          player2.end_game('draw');
          _this.draw();
          res(0);
          return;
        }
        _this.draw();
        p2p();
      });
    }
    function p2p(){
      player2.play(_this).then(()=>{
        if(_this.ended()){
          player1.end_game('lost');
          player2.end_game('won');
          _this.draw();
          res(2);
          return;
        }
        if(_this.is_draw()){
          player1.end_game('draw');
          player2.end_game('draw');
          _this.draw();
          res(0);
          return;
        }
        _this.draw();
        p1p();
      });
    }
    p1p();
    /*intt = setInterval(function(){
      tick = !tick;
      console.log('tick!');
      if(tick){
      player1.play(_this);
      _this.draw();
      if(_this.ended()){
        console.log('1w');
        player1.end_game('won');
        player2.end_game('lost');
        c(1);
        return;
      }
      if(_this.is_draw()){
        console.log('draw');
        player1.end_game('draw');
        player2.end_game('draw');
        c(0);
        return;
      }
      }else{
      player2.play(_this);
      _this.draw();
      if(_this.ended()){
        console.log('2w');
        player1.end_game('lost');
        player2.end_game('won');
        c(2);
        return;
      }
      if(_this.is_draw()){
        console.log('draw');
        player1.end_game('draw');
        player2.end_game('draw');
        c(0);
        return;
      }
      }
    }, TM);*/
  });}
  ended(){
    return (
       (
         (this.slots[0] && this.slots[0] == this.slots[3] && this.slots[3] == this.slots[6]) ||
         (this.slots[1] && this.slots[1] == this.slots[4] && this.slots[4] == this.slots[7]) ||
         (this.slots[2] && this.slots[2] == this.slots[5] && this.slots[5] == this.slots[8])
       ) ||
       (
         (this.slots[0] && this.slots[0] == this.slots[1] && this.slots[1] == this.slots[2]) ||
         (this.slots[3] && this.slots[3] == this.slots[4] && this.slots[4] == this.slots[5]) ||
         (this.slots[6] && this.slots[6] == this.slots[7] && this.slots[7] == this.slots[8])
       ) ||
       (
         (this.slots[0] && this.slots[0] == this.slots[4] && this.slots[4] == this.slots[8]) ||
         (this.slots[2] && this.slots[2] == this.slots[4] && this.slots[4] == this.slots[6])
       ) );
  }
  is_draw(){
    //if(this.slots[0] && this.slots[1] && this.slots[2] && this.slots[3] && this.slots[4] && this.slots[5] && this.slots[6] && this.slots[7] && this.slots[8])console.log('draw');
    return this.slots[0] && this.slots[1] && this.slots[2] && this.slots[3] && this.slots[4] && this.slots[5] && this.slots[6] && this.slots[7] && this.slots[8]; 
  }
}
var MENACES = 0;
class MENACEPlayer {
  constructor(){
    this.on = true;
    this.name = 'MENACE '+(++MENACES);
    this.situations = {};
    this.games_played = 0;
    this.draws = 0;
    this.wins = 0;
    this.defeats = 0;
  }
  start_new(sign){
    this.used = [];
    this.sign = sign;
  }
  end_game(status){
    this.games_played++;
    switch(status){
      case 'won':
      this.wins++;
      for(var i=0;i<this.used.length;i++){
        var loc = this.used[i];
        for(var _=0;_<2;_++)this.situations[loc[0]].push(loc[1]);
      }
      break;
      case 'draw':
      this.draws++;
      for(var i=0;i<this.used.length;i++){
        var loc = this.used[i];
        this.situations[loc[0]].push(loc[1]);
      }
      break;
      case 'lost':
      this.defeats++;
      for(var i=2;i<this.used.length;i++){
        var loc = this.used[i];
        this.situations[loc[0]].splice(this.situations[loc[0]].indexOf(loc[1]), 1);
      }
      break;
    }
  }
  toString(){
    return JSON.stringify(this.situations);
  }
  situ(b){
    var ta = new Array(18);
    for(var i=0;i<9;i++){
      ta[i*2] = i;
      ta[i*2+1] = i;
      //ta[i*4+2] = i;
      //ta[i*4+3] = i;
    }
    return [JSON.stringify(b), ta];
  }
  sit(){
    var ta = new Array(9);
    for(var i=0;i<9;i++){
      ta[i] = i;
    }
    return ta;
  }
  play(B){
    var _this = this;
    return new Promise(res=>{
    var str = JSON.stringify(B.slots);
    var str2 = JSON.stringify(rotate90(B.slots));
    var str3 = JSON.stringify(rotate90(rotate90(B.slots)));
    var str1 = JSON.stringify(rotate90(rotate90(rotate90(B.slots))));
    var sstr = 0;
    if(str in _this.situations){
      sstr = 0;
    }else if(str1 in _this.situations){
      sstr = 1;
    }else if(str2 in _this.situations){
      sstr = 2;
    }else if(str3 in _this.situations){
      sstr = 3;
    }else{
      var s = _this.situ(B.slots);
      _this.situations[s[0]] = s[1];
      sstr = 0;
    }
    switch(sstr){
      case 0:
      break;
      case 1:
      str = str1;
      break;
      case 2:
      str = str2;
      break;
      case 3:
      str = str3;
      break;
    }
    // console.log(sstr);
    // console.log(str);
    // if(_this.situations[str].length == 0){
    //   _this.situations[str] = _this.sit();
    // }
    var sbhv = null;
    while(true){
      var bhv = array_rand(_this.situations[str]);
      if(bhv === undefined) {
        _this.situations[str] = _this.sit();
        //console.log('Meow meow meow...');
        continue;
      }
      for(var i=0;i<sstr;i++)bhv = rotatePosition90(bhv);
      if(B.valid(bhv)){
        sbhv = bhv;
        break;
      }else{
        _this.situations[str].splice(_this.situations[str].indexOf(bhv), 1);
      }
    }
    B.slots[sbhv] = _this.sign;
    _this.used.push([str, sbhv]);
    setTimeout(()=>{res();}, TM/5);
    });
  }
  join(o){
    if(!(o instanceof MENACEPlayer)){console.error('Argument 1 is not of type MENACEPlayer');return}
    for(var sit in o.situations){
      if(sit in this.situations){
        this.situations[sit] = this.situations[sit].concat(o.situations[sit]);
      }else {
        this.situations[sit] = o.situations[sit];
      }
    }
  }
}
MENACEPlayer.fromString = function(str){
  var what = new MENACEPlayer();
  what.situations = JSON.parse(str);
  return what;
};
var handle_click = ()=>{};
addEventListener('click', function(e){
  if(e.clientX > 500 || e.clientY > 500)return;
  else {
    var sqx = Math.floor(e.clientX / third);
    var sqy = Math.floor(e.clientY / third);
    handle_click(sqx, sqy);
  }
});
class HumanPlayer {
  
  constructor(){
    this.on = true;
    this.sign= 0;
    this.name = 'Humain';
  }
  start_new(s){
    this.sign = s;
  }
  play(b){
    return new Promise(resolve => {
      handle_click = (x, y) => {
        if(b.valid(y * 3 + x)){
          b.slots[y * 3 + x] = this.sign;
          resolve();
        }
      };
    });
  }
  end_game(){}
}
class RandomPlayer {
  constructor(){
    this.on = true;
    this.name='Hasard'
  }
  start_new(s){this.sign = s}
  play(b){
    return new Promise(resolve => {
      var cf = -1;
      while(!b.valid(cf)) cf = array_rand([0,1,2,3,4,5,6,7,8]);
      b.slots[cf] = this.sign;
      resolve();
    });
  }
  end_game(){}
  
}
class NotPerfectPlayer {
  constructor(){
    this.name = 'Truc bizarre';
  }
  start_new(s){
    this.sign = s;
    this.mp = 0;
    this.lp = 0;
  }
  play(b){
    var _this = this;
    return new Promise(resolve => {
    if(_this.mp==0){
      if(!b.slots[0]){
        b.slots[0] = _this.sign;
      }else {
        b.slots[2] = _this.sign;
        this.lp = 2;
      }
      _this.mp++;
    }else if(_this.mp == 1){
      if(this.lp == 0){
        if(!b.slots[8]){
          b.slots[8] = _this.sign;
        }else{
          b.slots[6] = _this.sign;
        }
      }else{
         if(!b.slots[8]){
          b.slots[8] = _this.sign;
          }else{
          b.slots[6] = _this.sign;
          }
      }
    }else{
      var cf = -1;
      while(!b.valid(cf)) cf = array_rand([0,1,2,3,5,6,7,8,0,1,2,3,5,6,7,8,0,1,2,3,5,6,7,8,4]);
      b.slots[cf] = this.sign;
    }
    resolve();
    });
  }
  end_game(){}
}
// 0 1 2
// 3 4 5
// 6 7 8
var _start = +(new Date()), _p=false, __p, GPS = 0;
var p1 = new MENACEPlayer();
var sp1 = new RandomPlayer(), sp2 = new MENACEPlayer(), sp3 = new MENACEPlayer();
var thesecondplayers = [/*new NotPerfectPlayer(), */sp1, sp2, sp3], secondplayerindex = 0, pending_up = false, pp=false;
function next_player(){
  do {
    secondplayerindex++;
    secondplayerindex %= thesecondplayers.length;
  } while(!thesecondplayers[secondplayerindex].on);
  console.log(secondplayerindex);
}
var global_board = new Board(), pend = false;
var STOP_AT = Infinity;
var p2 = thesecondplayers[secondplayerindex];
var started = false;
function game(stat){
  if(p1.games_played >= STOP_AT){
    pend = true;
  }
  if(stat!==undefined){
    ctx.fillStyle = 'orange';
    var text = '';
    ctx.font = "30px sans-serif";
    if(stat==0)text="Égalité";
    else if(stat==1)text="O gagne";
    else if(stat==2)text="X gagne";
    ctx.fillText(text, 50, 50);
    if(pend && !(p2 instanceof HumanPlayer)){
      p2 = new HumanPlayer();
      TM = 1000;
    }
    if(pending_up){
      pending_up = false;
      dgebi('fin').click();
      
    }
    if(_p){
      p1 = MENACEPlayer.fromString(__p);
      _p = false;
    }
    if(pp){
      var fr = new FileReader();
      fr.readAsText(dgebi('fin').files[0]);
      fr.onload = function(event) { _p = true;__p = fr.result; };
      pp = false;
    }
    dgebi('taux').innerText = `MENACE a gagné ${(p1.wins / p1.games_played * 100).toFixed(2)}% des ${p1.games_played} parties. `;
    dgebi('opp').innerText = 'MENACE joue contre : '+ p2.name;
    if(!pend){
    next_player();
    p2 = thesecondplayers[secondplayerindex];
    }
    setTimeout(()=>{
      if(GPS == 5){
        var _time = +(new Date());
        var _delay = (_time - _start)/1000;
        var _pps = GPS / _delay;
        pps.innerText = _pps.toFixed(2)+' PPS';
        global_board.play(p1, p2).then(game);
        GPS = 0;
        _start = +(new Date());
      }else{
        global_board.play(p1, p2).then(game);
      }
    }, TM*2);
  }
  else global_board.play(p1, p2).then(game);
  GPS++;
}
if(inIFrame){
  game();
  started = true;
}
function human(){
  pend = true;
}
function down(){
  var str = p1.toString();
  dgebi('adw').href = 'data:text/plain;base64,' + btoa(str);
  dgebi('adw').click();
}
function up(){
  pending_up = true;
}
function menacer(){
  pp=true;
}
