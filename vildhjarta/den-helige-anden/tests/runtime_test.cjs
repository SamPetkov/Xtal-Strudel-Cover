// Test the Strudel-facing generated JS against a minimal synchronous API mock.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const src = process.argv[2] || path.join(__dirname,'../den-helige-anden.js');
const text = fs.readFileSync(src,'utf8').replace('$score:', 'globalThis.score =');
class Pattern {
  constructor(query) {this.query = query;}
}
for(const name of ['bank','gain','orbit','s','clip','distort','lpf','pan','room','delay','delaytime','midichan','midi']) {
 Pattern.prototype[name] = function() { return this; };
}
class TimeSpan {constructor(begin,end){this.begin=begin;this.end=end;}}
class Hap {constructor(whole,part,value){this.whole=whole;this.part=part;this.value=value;}}
const ctx={Pattern, TimeSpan,Hap, setcpm:()=>{},
 stack:(...parts)=>new Pattern(state=>parts.flatMap(p=>p.query(state)))};
vm.createContext(ctx);
vm.runInContext(text,ctx,{timeout:15000,filename:src});
const info=vm.runInContext('({loop:LOOP_LENGTH, counts:SCHEDULES.map(x=>x.length), speed:TEMPOS, bars:BAR_TICKS.length-1, section:SECTIONS, notes:SCHEDULES, pitches:TRACK_NAMES})',ctx);
const all=ctx.score.query({span:{begin:0,end:info.loop}});
assert.equal(info.bars,137);
assert.equal(info.pitches.length,11);
assert.deepEqual(Array.from(info.counts,Number),[1556,749,1094,1087,152,152,444,444,183,736,643]);
assert.equal(all.length,7240);
assert(all.every(h=>h.whole.begin>=0&&h.whole.end<=info.loop+1e-7));
assert(all.every(h=>h.part.begin>=0&&h.part.end>=h.part.begin));
let count=0;
for(let t=0;t<info.loop;t+=.2) {
  const inWindow=ctx.score.query({span:{begin:t,end:Math.min(t+.2,info.loop)}});
  for(const h of inWindow) if(h.whole.begin>=t&&h.whole.begin<t+.2) count++;
}
assert.equal(count,all.length);
console.log('JS TEST PASS: 137 bars, 11 tracks, '+all.length+' onsets; queries reproduce one full loop');
console.log('SONG LENGTH (seconds):',info.loop.toFixed(5));
console.log('SCORE TIME MAP:',JSON.stringify(info.speed));