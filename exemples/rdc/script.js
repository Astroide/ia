function $(_){
  return document.querySelector(_);
}
function miou () {
  grid = array(W, H, function(){return new Square(false);});
      for(var i=0;i<W;i++){
        grid[i][0].W=false;
      }
      for(var i=0;i<W;i++){
        grid[i][H-1].W=false;
      }
}
var canvas = $('#draw'), ctx = canvas.getContext('2d');
var openList, currentSquare, closedList, lwfc, ind = 0, eight, cx, cy, target, path;
function heuristic(x, y, xx, yy){
  return (x-xx)**2 + (y-yy)**2;
}
function wrap(n, max){
  return n;
  if(n>max)return 0;
  if(n<0)return max;
}
function ASTAR(FX, FY, TOX, TOY, GRID, player){
  openList = [GRID[FX][FY]];
  target = GRID[TOX][TOY];
  var start = GRID[FX][FY];
  start.parent = null;
  for(var x=0;x<grid.length;x++){
    for(var y=0;y<grid[x].length;y++){
      grid[x][y].X = x;
      grid[x][y].Y = y;
    }
  }
  eight = [];
  closedList = [];
  openList[0].g = 0;
  openList[0].h = 0;
  openList[0].f = 0;
  openList[0].X = FX;
  openList[0].Y = FY;
  while(true){
    ind = 0;
    lwfc = Infinity;
    for(var i=0;i<openList.length;i++){
      if(openList[i].f<lwfc){
        ind = i;
        lwfc = openList[i].f;
      }
    }
    currentSquare = openList[ind];
    closedList.push(currentSquare);
    if(currentSquare==target){
          path = [];
          while(true){
            path.push([currentSquare.X, currentSquare.Y]);
            if(currentSquare.parent){
              currentSquare = currentSquare.parent;
              if(currentSquare===start)break;
            }else break;
          }
          if(player){
            var iint = 0;
            iint = setInterval(()=>{
              var put = path.pop();
              if(put){
                GRID[put[0]][put[1]].WW = true;
              }else{
                clearInterval(iint);
                return;
              }
            }, 1000);
          }
          return path;
    }
    openList.splice(ind, 1);
    if(openList == []){
      return -1;
    }
    try{
      cx = currentSquare.X;

    }catch(e){
      return -1;
    }
    
    cy = currentSquare.Y;
    eight = [(GRID[cx]||[])[wrap(cy-1, grid[0].length-1)], (GRID[cx]||[])[wrap(cy+1, grid[0].length-1)], (GRID[wrap(cx-1, grid.length-1)]||[])[cy], (GRID[wrap(cx+1, grid.length-1)]||[])[cy]];
    for(var i=0;i<eight.length;i++){
      if((!eight[i]) || eight[i].W || closedList.includes(eight[i])){
        continue;
      }
      
      if(!openList.includes(eight[i])){
        
        openList.push(eight[i]);
        eight[i].parent = currentSquare;
        eight[i].g = currentSquare.g+1;
        eight[i].h = heuristic(eight[i].X,eight[i].Y, TOX, TOY);
        eight[i].f = eight[i].g+eight[i].h;
        
      }else{
        if(currentSquare.g<eight[i].g){
          
          eight[i].parent = currentSquare;
          eight[i].g = heuristic(eight[i].X, eight[i].Y, TOX, TOY);
          eight[i].f = eight[i].h+eight[i].g;
        }
      }
    }
  }
}
function DIJKSTRA(FX, FY, TOX, TOY, GRID, player){
  openList = [GRID[FX][FY]];
  target = GRID[TOX][TOY];
  var start = GRID[FX][FY];
  for(var x=0;x<grid.length;x++){
    for(var y=0;y<grid[x].length;y++){
      grid[x][y].X = x;
      grid[x][y].Y = y;
      grid[x][y].c = Infinity;
      grid[x][y].parent = null;
      if(!openList.includes(grid[x][y]) && !grid[x][y].W) openList.push(grid[x][y]);
    }
  }
  eight = [];
  openList[0].c = 0;
  openList[0].X = FX;
  openList[0].Y = FY;
  openList[0].parent = null;
  while(true){
    openList = openList.sort((a, b) => {
      return a.c < b.c;
    });
    var currentSquare = openList[0];
    cx = currentSquare.X;
    cy = currentSquare.Y;
    eight = [(GRID[cx]||[])[cy-1], (GRID[cx]||[])[cy+1], (GRID[cx-1]||[])[cy], (GRID[cx+1]||[])[cy]];
    eight = eight.filter(e => {return !!e && openList.includes(e)});
    if(currentSquare.parent === null && currentSquare !== start){
      eight = eight.sort((a, b) => {
        return a.c < b.c;
      });
      //currentSquare.parent = eight[0];
    }
    ///console.log(eight);
    for(var s of eight){
      if(s.W) continue;
      console.log(currentSquare.c, s.c);
      if((currentSquare.c+1) <= s.c){
        s.parent = currentSquare;
        s.c = currentSquare.c + 1;
      }
    }
    openList.splice(0, 1);
    if(currentSquare === target){
      path = [];
      meow:while(true){
        path.push([currentSquare.X, currentSquare.Y]);
        if(currentSquare.parent){
          currentSquare = currentSquare.parent;
          if(currentSquare===start)break meow;
        }else break;
      }
      //path = path.reverse();
      console.log(path);
      return path;
    }
    if(openList.length === 0) return -1;
  }
}
var alg = ASTAR;
function PF(...args){
  return alg(...args);
}
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function array(d1, d2, def){
  var arr = new Array(d1);
  for(var i=0;i<d1;i++){
    arr[i] = new Array(d2);
    for(var x=0;x<d2;x++){
      arr[i][x] = def?def():0;
    }
  }
  return arr;
}
class Square {
  constructor(w){
    this.W =Math.random()>0.7;
  }
}
var W = parseInt(canvas.width/20), H = parseInt(canvas.height/20), grid = array(W, H, function(){return new Square(false);}), w=false, a=false, s=false, d=false;
var robotX = W-1, robotY = H-1, playerX = 0, playerY = 0;
grid[playerX][playerY].W=false;
grid[robotX][robotY].W=false;
function gid(){
  ctx.strokeStyle = 'black';
  for(var i=0;i<W;i++){
    ctx.strokeRect(i*20, 0, 20, 20*H);
  }
  for(var i=0;i<H;i++){
    ctx.strokeRect(0, i*20, 20*W, 20);
  }
}
var cached0 = playerX+1, cached1 = playerY+1, ct = false;
function moveRobot(){
  var pp = false;
  if(cached0===playerX&&cached1===playerY&&(!ct)){
    pp = true;
  }else{
    ct = false;
    cached0 = playerX;
    cached1 = playerY;
    console.time('a* call');
    var path = PF(robotX, robotY, playerX, playerY, grid);
    if(typeof path == 'number'){
      grid = array(W, H, function(){return new Square(false);});
      for(var i=0;i<W;i++){
        grid[i][0].W=false;
      }
      for(var i=0;i<W;i++){
        grid[i][H-1].W=false;
      }
      moveRobot();
      return;
    }
    p = path;
    console.timeEnd('a* call');
    pindex = p.length-1;
  }
  pindex%=p.length;
  try{
    robotX = p[pindex][0];
    robotY = p[pindex][1];
  }catch(e){}
  if(pp){
    pindex--;
  }
}
function pplyKeys(){
  var b0 = playerX, b1 = playerY;
  (function(){
  if(w){
    playerY--;
    return;
  }
  if(s){
    playerY++;
    return;
  }
  if(a){
    playerX--;
    return;
  }
  if(d){
    playerX++;
    return;
  }
  })();
  playerX%=W;
  playerY%=H;
  if(playerX<0)playerX=W-1;
  if(playerY<0)playerY=H-1;
  if(grid[playerX][playerY].W){
  playerX = b0;
  playerY = b1;
  }
}
var mr = false;
function dg(){
  //pplyKeys();
  ctx.clearRect(0, 0, W*20, H*20);
  mr=!mr;
  if(mr)moveRobot();
  for(var y=0;y<W;y++){
    for(var x=0;x<H;x++){
      switch(grid[y][x].W){
        case false:
        ctx.fillStyle = '#fff';
        break;
        case true:
        ctx.fillStyle = '#000';
        break;
      }
      ctx.fillRect(y*20, x*20, 20, 20);
    }
  }
  ctx.fillStyle='rgba(255,255,0,0.2)';
  for(var i=0;i<closedList.length;i++){
    if(!closedList[i])continue;
    ctx.fillRect(closedList[i].X*20, closedList[i].Y*20, 20, 20);
  }
  ctx.fillStyle='rgba(0,0,255,0.2)';
  for(var i=0;i<openList.length;i++){
    ctx.fillRect(openList[i].X*20, openList[i].Y*20, 20, 20);
  }
  ctx.strokeStyle='rgba(0,0,255,1)';
  ctx.lineWidth = 3;
  for(var i=0;i<pindex+1;i++){
    ctx.strokeRect(p[i][0]*20, p[i][1]*20, 20, 20);
  }
  ctx.lineWidth = 1;
  
  ctx.fillStyle = 'green';
  ctx.fillRect(playerX*20+5, playerY*20+5, 10, 10);
  ctx.fillStyle = 'red';
  ctx.fillRect(robotX*20+5, robotY*20+5, 10, 10);
  gid();
  setTimeout(()=>requestAnimationFrame(dg), 50);
}
var p = 0;
while(true){
  miou();
  p = PF(robotX, robotY, playerX, playerY, grid);
  if(typeof p !== 'number')break;
}
var pindex = p.length-1;
dg();
addEventListener('keydown', function(e){
  switch(String.fromCharCode(e.keyCode || e.which).toLowerCase()){
    case 'w':
    w=true;
    a=false;
    s=false;
    d=false;
    break;
    case 'a':
    w=false;
    a=true;
    s=false;
    d=false;
    break;
    case 's':
    w=false;
    a=false;
    s=true;
    d=false;
    break;
    case 'd':
    w=false;
    a=false;
    s=false;
    d=true;
    break;
    default:
    break;
  }
});
canvas.addEventListener('click', function(zzz){
  var bx = playerX, by = playerY;
  playerX = parseInt(zzz.offsetX/20);
  playerY = parseInt(zzz.offsetY/20);
  var CLC = closedList.slice();
  if(typeof PF(robotX, robotY, playerX, playerY, grid) == 'number'){
    playerX = bx;
    playerY = by;
    closedList = CLC;
  }
});
for(var i=0;i<W;i++){
  grid[i][0].W=false;
}
for(var i=0;i<W;i++){
  grid[i][H-1].W=false;
}
