/**
 * Copyright (c) 2020 Olie Auger
 */
window.isNaN = window.isNaN || (n => n!=n);
var mx=0, my=0, defc = $('#def');
function adjustMousePosition(e){
  mx = e.clientX;
  my = e.clientY;
}
addEventListener('mousemove', adjustMousePosition);
var state = 'paused', csp = 0.5;
function $$(sel){
  return document.querySelectorAll(sel);
}
function LoadImage(src){
  loadImage.count++;
  var i = new Image();
  i.src = src;
  i.onload = ()=>
    (++loadImage.loaded == loadImage.count) && $('.loading').classList.add('loaded');
  return i;
}


function newElt(html){
  var elt = document.createElement('div');
  elt.innerHTML = html;
  return elt;
}
function ne (x) {
  return function(y){
    return newElt(x.indexOf('$')>-1?x.replace('$', y):x);
  }
}
var currentdate = -1, year = $('#d1'), iyr = $('#d2'), paragraph = $('#content');

const Templates = {
  circle : ne('<div class="circle"></div><div class="circle-date">$</div>')
};

var timelineElt = $('.timeline');
var ww = window.innerWidth;
var dts = [];
function date(dt, inf){
  dts.push({__time:dt, __info:newElt('<div><h1 class="sticky">'+dt+'</h1>'+inf+'</div>')});
}

var elt_pause = $('#image_pause'), elt_play = $('#image_play'), elt_next = $('#image_next');
function changeButtonIcon(type){
  switch(type){
    case 'pause':
    elt_pause.style.display = 'block';
    elt_play.style.display = 'none';
    elt_next.style.display = 'none';
    break;
    case 'play':
    elt_pause.style.display = 'none';
    elt_play.style.display = 'block';
    elt_next.style.display = 'none';
    break;
    case 'next':
    elt_pause.style.display = 'none';
    elt_play.style.display = 'none';
    elt_next.style.display = 'block';
    break;
  }
}
function move(n){
  /*for(var a=$$('.circle, .circle-date'), i=0;i<a.length;i++){
    a[i].style.left = ((+a[i].style.left.replace('px', ''))-n)+'px';
  }*/
  
  currentdate += n;
  year.innerText = Math.floor(currentdate);
  iyr.value = Math.floor(currentdate);
  for(var dt of dts){
    if(currentdate == dt.__time){
      if(state=='backward' || state=='forward')csp = speed; 
      playing = false;
      paragraph.textContent = '';
      paragraph.appendChild(dt.__info);
      changeButtonIcon('next');
      state = 'date';
      defc.innerText = '';
    }
  }
  drawDates();
}
var inter = null, playing = false, update, playSpeed = 20, speed = 0.5;
function clearPauseInterval(){
  if(inter){clearInterval(inter);inter = null;}
}
function resume(){
  state = 'playing';
  clearPauseInterval();
  playing = true;
  inter=setInterval(update, playSpeed);
}
function pause(){
  clearPauseInterval();
  playing = false;
  state = 'paused';
}
function update(){
  if(playing)move(speed);
}

function togglePlayState(){
  if(state=='forward' || state == 'backward'){speed = 0.5;resume();
    changeButtonIcon('pause');}else
  if(playing){
    pause();
    changeButtonIcon('play');
  } else {
    if(state == 'date'){
      paragraph.textContent = '';
      window.scrollTo(0, 0);
      speed = csp;
    }
    resume();
    changeButtonIcon('pause');
  }
}
addEventListener('keypress', function(e){
  if(String.fromCharCode(e.keyCode || e.which) == ' '){togglePlayState();e.preventDefault();return false;}
});
var _____data = 0;
function goTo(){
  if(state=='date')return;
  _____data = state;
  if(state=='playing')togglePlayState();
  iyr.style.display = 'block';
  year.style.display = 'none';
  iyr.focus();
  iyr.select();
}
function _submit() {
  var input = parseInt(iyr.value);
  if(!isNaN(input)){
    move((input - currentdate)-speed);
  }
  iyr.style.display = 'none';
  year.style.display='block';
  if(!playing)togglePlayState();
}
function back(){
  if(playing){
  if(speed>0)speed = -0.5;else {speed = -1;currentdate = parseInt(currentdate);}
  state='backward';
  changeButtonIcon('play');
  }
}
function fwd(){
  if(playing){
  if(speed<0)speed = 0.5;else{ speed = 1; currentdate = parseInt(currentdate);}
  state='forward';
  changeButtonIcon('play');
  }
}
function start(){
  $('#foreground').classList.add('ok');
  $('#title').classList.add('ok');
  setTimeout(()=>{
    $('#foreground').style.display = 'none';
    $('#title').style.display = 'none';
  }, 2000);
  togglePlayState();
}

var textauto = $('#text-auto'), tstr = "L'intelligence artificielle\n{Par Olie Auger}", hdudas_index = 0;
function st(){

var interval = setInterval(function(){
  if(hdudas_index-1 == tstr.length){$('#ctc').style.display = 'inline';return;}
  else {
    setTimeout(()=>{
    textauto.innerHTML = tstr.slice(0,hdudas_index++).replace('\n', '<br>').replace('{', '<small>').replace('}', '</small>');
    }, Math.random()*70);
  }
}, 100);
}
var hduaioh = setInterval(()=> {
  if(__truth__){
    if(location.search.startsWith('?date=')){
      console.log(location.search.slice(6));
      let parsed = parseInt(location.search.slice(6));
      if(!isNaN(parsed)){
        start();
        to(parsed);
      }
    }
    st();
    clearInterval(hduaioh);
  }else{
    $('title').innerText = 'CHARGEMENT...';
  }
}, 100);

$$('.circle-date').forEach(elt => {
  elt.addEventListener('click', _ => {
    move((parseInt(elt.innerText) - currentdate)-speed);
    if(!playing)togglePlayState();
  });
});

var canvas = $('#line'), ctx = canvas.getContext('2d');
canvas.height = 70;
canvas.width = window.innerWidth;
{
  ctx.clearAll = function(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }
}
function circle(x, y, rad){
  ctx.beginPath();
  ctx.arc(x,y,rad,0,Math.PI*2);
  ctx.fill();
  ctx.closePath();
}
const FONT_HEIGHT_20PX = 1.286 * 20, FONT_HEIGHT_25PX = 1.286 * 25;
var FONT_HEIGHT;
function drawDates(){
  ctx.clearAll();
  ctx.fillStyle = "red";
  ctx.fillRect(0,32,canvas.width,6);
  ctx.font = "20px Courier";
  dts.sort((a, b) => {
    if(currentdate == a.__time) return -1000;
    if(currentdate == b.__time) return 1000;
    return (a.__time) - (b.__time);
  });
  var _color;
  for(var i=dts.length-1;i>-1;i--){
    var date = dts[i];
    ctx.fillStyle = "orange";
    var computedpos = (window.innerWidth/2+date.__time)-currentdate;
    circle(computedpos,35,7);
    ctx.fillStyle ="white";
    if(currentdate == date.__time){
      _color = "red";
      ctx.font = "25px Courier";
      FONT_HEIGHT = FONT_HEIGHT_25PX;
    } else {
      _color = "blue";
      ctx.font = "20px Courier";
      FONT_HEIGHT = FONT_HEIGHT_20PX;
    }
    var textmetrics = ctx.measureText(date.__time);
    ctx.fillRect(computedpos-2, 60 - FONT_HEIGHT/1.5, textmetrics.width+4, FONT_HEIGHT);
    ctx.strokeStyle = "lightblue";
    ctx.strokeRect(computedpos-2, 60 - FONT_HEIGHT/1.5, textmetrics.width+4, FONT_HEIGHT);
    ctx.fillStyle = _color;
    ctx.fillText(date.__time, computedpos, 60);
    
  }
}
window.onresize = e => {
  canvas.width = window.innerWidth;
  drawDates();
};
drawDates();
{
  let f = date;
  date = function(...args){
    f(...args);
    drawDates();
  }
}
function fetchdata(path) {
  return new Promise(resolve => {
    var myRequest = new Request(path);
    fetch(myRequest).then(function(response) {
      return response.text().then(function(text) {
        resolve(text);
      });
    });
  });
}
fetchdata('./contenu.ldt').then(filedata => {
  var data = parser.parse(filedata);
  for(key in data.entries){
    date(parseInt(key), data.entries[key]);
  }
  $('title').innerText = data.title;
  tstr = `${data.title}\n{${data.subtitle}}`;
  limg();
});
function to(dt){
  move((dt - currentdate)-speed);
  if(!playing)togglePlayState();
}
addEventListener('click', ev => {
  if(my > 30 && my < 40){
    for(var theDate of dts){
      if(((window.innerWidth/2+theDate.__time)-currentdate)-mx < 1.1){
        to(theDate.__time);
        return;
      }
    }
  }
});
var definitions = {};
function SET_DEFINITIONS(defs){
  definitions = defs || {};
}
function sdef(df){
  if(df in definitions){
    var d = definitions[df];
    var header = d[0], body = d[1];
    defc.innerHTML+= d[2]?`<h1>${header}</h1><p>${body}</p><hr>`:`<h1><small>Définition de: </small>${header}</h1><p>${body}</p><hr>`;
  }else{
    console.log('Error: definition \''+df+'\' does not exist');
  }
}
SET_DEFINITIONS({
  lsep: ['Linéairement séparable', 'Veut dire que si une donnée est représentée par un point à n dimensions (n=nombre d\'entrées du perceptron), qu\'on peut séparer les données en catégories par une ligne droite ou un plan.'],
  gpu: ['GPU (Graphics Processing Unit)', 'Processeur optimisé pour les calculs graphiques.'],
  cpu: ['CPU (Central Processing Unit)', 'Processeur central d\'un ordinateur, utilisé pour à peu près tout.'],
  'a*': ['Explication',`C'est assez simple. Prenons, par exemple, quelqu'un qui n'est jamais venu au Québec. Il veut aller de Montréal à Québec. Si il pense que la baie d'Hudson est proche de Québec, il va regarder quelles routes passent par la baie d'Hudson pour se rendre à Québec et verra bien que cela fait un détour inutilement. Il n'empruntera donc pas cette route. Par contre, si il croit que les autoroutes 20 et 40 ne passent pas par Québec, il ne considérera pas les routes empruntant ces autoroutes et sont trajet sera inutilement long.`,true]
});