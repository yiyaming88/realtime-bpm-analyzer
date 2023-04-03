export default `"use strict";(()=>{var d=(a,t,e)=>new Promise((o,s)=>{var n=i=>{try{l(e.next(i))}catch(c){s(c)}},r=i=>{try{l(e.throw(i))}catch(c){s(c)}},l=i=>i.done?o(i.value):Promise.resolve(i.value).then(n,r);l((e=e.apply(a,t)).next())});var x="realtime-bpm-processor";function f(s){return d(this,arguments,function*(a,t=.3,e=.95,o=.05){let n=e;do if(n-=o,yield a(n))break;while(n>t)})}function T(a=.3,t=.95,e=.05){let o={},s=t;do s-=e,o[s.toString()]=[];while(s>a);return o}function A(a=.3,t=.95,e=.05){let o={},s=t;do s-=e,o[s.toString()]=0;while(s>a);return o}function h(){let t=0,e=new Float32Array(0);function o(){t=0,e=new Float32Array(0)}function s(){return t===4096}function n(){o()}return function(r){s()&&n();let l=new Float32Array(e.length+r.length);return l.set(e,0),l.set(r,e.length),e=l,t+=r.length,{isBufferFull:s(),buffer:e,bufferSize:4096}}}function v(a,t,e=0,o=1e4){let s=[],{length:n}=a;for(let r=e;r<n;r+=1)a[r]>t&&(s.push(r),r+=o);return{peaks:s,threshold:t}}function B(o,s){return d(this,arguments,function*(a,t,e=15){let n=!1,r=.3;if(yield f(l=>d(this,null,function*(){return n?!0:(a[l].length>e&&(n=!0,r=l),!1)})),n&&r){let l=F(a[r]),i=V(t,l);return{bpm:w(i),threshold:r}}return{bpm:[],threshold:r}})}function w(a,t=5){return a.sort((e,o)=>o.count-e.count).splice(0,t)}function F(a){let t=[];for(let e=0;e<a.length;e++)for(let o=0;o<10;o++){let s=a[e],n=e+o,r=a[n]-s;if(!t.some(i=>i.interval===r?(i.count+=1,i.count):!1)){let i={interval:r,count:1};t.push(i)}}return t}function V(a,t){let e=[];for(let o of t){if(o.interval===0)continue;o.interval=Math.abs(o.interval);let s=60/(o.interval/a);for(;s<90;)s*=2;for(;s>180;)s/=2;if(s=Math.round(s),!e.some(r=>r.tempo===s?(r.count+=o.count,r.count):!1)){let r={tempo:s,count:o.count,confidence:0};e.push(r)}}return e}var u={minValidThreshold:()=>.3,validPeaks:()=>T(),nextIndexPeaks:()=>A(),skipIndexes:()=>1,effectiveBufferTime:()=>0},m=class{constructor(t={}){this.options={continuousAnalysis:!1,stabilizationTime:2e4,muteTimeInIndexes:1e4};this.minValidThreshold=u.minValidThreshold();this.validPeaks=u.validPeaks();this.nextIndexPeaks=u.nextIndexPeaks();this.skipIndexes=u.skipIndexes();this.effectiveBufferTime=u.effectiveBufferTime();Object.assign(this.options,t)}setAsyncConfiguration(t){Object.assign(this.options,t)}reset(){this.minValidThreshold=u.minValidThreshold(),this.validPeaks=u.validPeaks(),this.nextIndexPeaks=u.nextIndexPeaks(),this.skipIndexes=u.skipIndexes(),this.effectiveBufferTime=u.effectiveBufferTime()}clearValidPeaks(t){return d(this,null,function*(){this.minValidThreshold=Number.parseFloat(t.toFixed(2)),yield f(e=>d(this,null,function*(){return e<t&&(delete this.validPeaks[e],delete this.nextIndexPeaks[e]),!1}))})}analyzeChunck(t,e,o,s){return d(this,null,function*(){this.effectiveBufferTime+=o;let n=o*this.skipIndexes,r=n-o;yield this.findPeaks(t,o,r,n),this.skipIndexes++;let l=yield B(this.validPeaks,e),{threshold:i}=l;s({message:"BPM",result:l}),this.minValidThreshold<i&&(s({message:"BPM_STABLE",result:l}),yield this.clearValidPeaks(i)),this.options.continuousAnalysis&&this.effectiveBufferTime/e>this.options.stabilizationTime/1e3&&(this.reset(),s({message:"ANALYZER_RESETED"}))})}findPeaks(t,e,o,s){return d(this,null,function*(){yield f(n=>d(this,null,function*(){if(this.nextIndexPeaks[n]>=s)return!1;let r=this.nextIndexPeaks[n]%e,{peaks:l,threshold:i}=v(t,n,r);if(l.length===0)return!1;for(let c of l)this.nextIndexPeaks[i]=o+c+this.options.muteTimeInIndexes,this.validPeaks[i].push(o+c);return!1}),this.minValidThreshold)})}};var y=class extends AudioWorkletProcessor{constructor(){super();this.realTimeBpmAnalyzer=new m;this.stopped=!1;this.aggregate=h(),this.port.addEventListener("message",this.onMessage.bind(this)),this.port.start()}onMessage(e){e.data.message==="ASYNC_CONFIGURATION"&&(console.log("[processor.onMessage] ASYNC_CONFIGURATION"),this.realTimeBpmAnalyzer.setAsyncConfiguration(e.data.parameters)),e.data.message==="RESET"&&(console.log("[processor.onMessage] RESET"),this.aggregate=h(),this.stopped=!1,this.realTimeBpmAnalyzer.reset()),e.data.message==="STOP"&&(console.log("[processor.onMessage] STOP"),this.aggregate=h(),this.stopped=!0,this.realTimeBpmAnalyzer.reset())}process(e,o,s){let n=e[0][0];if(this.stopped||!n)return!0;let{isBufferFull:r,buffer:l,bufferSize:i}=this.aggregate(n);return r&&this.realTimeBpmAnalyzer.analyzeChunck(l,sampleRate,i,c=>{this.port.postMessage(c)}).catch(c=>{console.error(c)}),!0}};registerProcessor(x,y);var U={};})();
//# sourceMappingURL=realtime-bpm-processor.js.map
`;