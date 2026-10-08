(function(root){
const shapes=[[[1,1,1,1]],[[1,1],[1,1]],[[0,1,0],[1,1,1]],[[0,1,1],[1,1,0]],[[1,1,0],[0,1,1]],[[1,0,0],[1,1,1]],[[0,0,1],[1,1,1]]];
class Engine{
 constructor(random=Math.random){this.random=random;this.reset()}
 reset(){this.board=Array.from({length:20},()=>Array(10).fill(0));this.bag=[];this.score=0;this.lines=0;this.over=false;this.next=this.take();this.spawn()}
 take(){if(!this.bag.length){this.bag=[0,1,2,3,4,5,6];for(let i=6;i>0;i--){let j=Math.floor(this.random()*(i+1));[this.bag[i],this.bag[j]]=[this.bag[j],this.bag[i]]}}return this.bag.pop()}
 get level(){return 1+Math.floor(this.lines/10)}
 get interval(){return Math.max(100,800-(this.level-1)*60)}
 spawn(){this.type=this.next;this.next=this.take();this.piece=shapes[this.type].map(r=>r.slice());this.x=Math.floor((10-this.piece[0].length)/2);this.y=0;if(this.collides(this.piece,this.x,this.y))this.over=true}
 collides(piece,x,y){return piece.some((r,dy)=>r.some((v,dx)=>v&&(x+dx<0||x+dx>=10||y+dy>=20||(y+dy>=0&&this.board[y+dy][x+dx]))))}
 move(dx){if(this.over)return false;if(!this.collides(this.piece,this.x+dx,this.y)){this.x+=dx;return true}return false}
 rotate(){if(this.over)return false;const rotated=this.piece[0].map((_,i)=>this.piece.map(r=>r[i]).reverse());for(const dx of [0,-1,1,-2,2])if(!this.collides(rotated,this.x+dx,this.y)){this.piece=rotated;this.x+=dx;return true}return false}
 down(soft=false){if(this.over)return false;if(!this.collides(this.piece,this.x,this.y+1)){this.y++;if(soft)this.score++;return true}this.lock();return false}
 drop(){if(this.over)return;while(!this.collides(this.piece,this.x,this.y+1)){this.y++;this.score+=2}this.lock()}
 ghost(){let y=this.y;while(!this.collides(this.piece,this.x,y+1))y++;return y}
 lock(){const level=this.level;this.piece.forEach((r,dy)=>r.forEach((v,dx)=>{if(v)this.board[this.y+dy][this.x+dx]=this.type+1}));const remaining=this.board.filter(r=>r.some(v=>!v)),cleared=20-remaining.length;this.board=[...Array.from({length:cleared},()=>Array(10).fill(0)),...remaining];this.lines+=cleared;this.score+=[0,100,300,500,800][cleared]*level;this.spawn()}
}
const api={Engine,shapes};if(typeof module!=='undefined')module.exports=api;else root.KittyEngine=api;
})(globalThis);
