export default `"use strict";(()=>{var c=(n,s,e)=>new Promise((r,t)=>{var a=l=>{try{i(e.next(l))}catch(d){t(d)}},o=l=>{try{i(e.throw(l))}catch(d){t(d)}},i=l=>l.done?r(l.value):Promise.resolve(l.value).then(a,o);i((e=e.apply(n,s)).next())});var A="realtime-bpm-processor";function m(t){return c(this,arguments,function*(n,s=.2,e=.95,r=.05){let a=e;do if(a-=r,yield n(a))break;while(a>s)})}function v(n=.2,s=.95,e=.05){let r={},t=s;do t-=e,r[t.toString()]=[];while(t>n);return r}function b(n=.2,s=.95,e=.05){let r={},t=s;do t-=e,r[t.toString()]=0;while(t>n);return r}function h(){let s=0,e=new Float32Array(0);function r(){s=0,e=new Float32Array(0)}function t(){return s===4096}function a(){r()}return function(o){t()&&a();let i=new Float32Array(e.length+o.length);return i.set(e,0),i.set(o,e.length),e=i,s+=o.length,{isBufferFull:t(),buffer:e,bufferSize:4096}}}function I(n,s,e=0,r=1e4){let t=[],{length:a}=n;for(let o=e;o<a;o+=1)n[o]>s&&(t.push(o),o+=r);return{peaks:t,threshold:s}}function B(r,t){return c(this,arguments,function*(n,s,e=15){let a=!1,o=.2;if(yield m(i=>c(this,null,function*(){return a?!0:(n[i].length>e&&(a=!0,o=i),!1)})),a&&o){let i=w(n[o]),l=S(s,i);return{bpm:V(l),threshold:o}}return{bpm:[],threshold:o}})}function V(n,s=5){return n.sort((e,r)=>r.count-e.count).splice(0,s)}function w(n){let s=[];for(let e=0;e<n.length;e++)for(let r=0;r<10;r++){let t=n[e],a=e+r,o=n[a]-t;if(!s.some(l=>l.interval===o?(l.count+=1,l.count):!1)){let l={interval:o,count:1};s.push(l)}}return s}function S(n,s){let e=[];for(let r of s){if(r.interval===0)continue;r.interval=Math.abs(r.interval);let t=60/(r.interval/n);for(;t<90;)t*=2;for(;t>180;)t/=2;if(t=Math.round(t),!e.some(o=>o.tempo===t?(o.count+=r.count,o.count):!1)){let o={tempo:t,count:r.count,confidence:0};e.push(o)}}return e}var u={minValidThreshold:()=>.2,validPeaks:()=>v(),nextIndexPeaks:()=>b(),skipIndexes:()=>1,effectiveBufferTime:()=>0},f=class{constructor(){this.options={continuousAnalysis:!1,stabilizationTime:2e4,muteTimeInIndexes:1e4,debug:!1};this.minValidThreshold=u.minValidThreshold();this.validPeaks=u.validPeaks();this.nextIndexPeaks=u.nextIndexPeaks();this.skipIndexes=u.skipIndexes();this.effectiveBufferTime=u.effectiveBufferTime();this.lastTopBpmCandidate=void 0;this.topBpmCandidateCount=0;this.computedStabilizationTimeInSeconds=0;this.updateComputedValues()}setAsyncConfiguration(s){Object.assign(this.options,s),this.updateComputedValues()}updateComputedValues(){this.computedStabilizationTimeInSeconds=this.options.stabilizationTime/1e3}reset(){this.minValidThreshold=u.minValidThreshold(),this.validPeaks=u.validPeaks(),this.nextIndexPeaks=u.nextIndexPeaks(),this.skipIndexes=u.skipIndexes(),this.effectiveBufferTime=u.effectiveBufferTime()}clearValidPeaks(s){return c(this,null,function*(){this.minValidThreshold=Number.parseFloat(s.toFixed(2)),yield m(e=>c(this,null,function*(){return e<s&&(delete this.validPeaks[e],delete this.nextIndexPeaks[e]),!1}))})}analyzeChunck(s,e,r,t){return c(this,null,function*(){this.options.debug&&t({message:"ANALYZE_CHUNK",data:s}),this.effectiveBufferTime+=r;let a=r*this.skipIndexes,o=a-r;yield this.findPeaks(s,r,o,a,t),this.skipIndexes++;let i=yield B(this.validPeaks,e),{threshold:l}=i;if(t({message:"BPM",result:i}),i.bpm.length>0){let d=i.bpm[0].tempo;this.lastTopBpmCandidate===d?this.topBpmCandidateCount++:(this.topBpmCandidateCount=1,this.lastTopBpmCandidate=d)}(this.minValidThreshold<l||this.topBpmCandidateCount>=50)&&(t({message:"BPM_STABLE",result:i}),yield this.clearValidPeaks(l)),this.options.continuousAnalysis&&this.effectiveBufferTime/e>this.computedStabilizationTimeInSeconds&&(this.reset(),t({message:"ANALYZER_RESETED"}))})}findPeaks(s,e,r,t,a){return c(this,null,function*(){yield m(o=>c(this,null,function*(){if(this.nextIndexPeaks[o]>=t)return!1;let i=this.nextIndexPeaks[o]%e,{peaks:l,threshold:d}=I(s,o,i);if(l.length===0)return!1;for(let y of l){let g=r+y;this.nextIndexPeaks[d]=g+this.options.muteTimeInIndexes,this.validPeaks[d].push(g),this.options.debug&&a({message:"VALID_PEAK",data:{threshold:d,index:g}})}return!1}),this.minValidThreshold)})}};var x=class extends AudioWorkletProcessor{constructor(){super();this.realTimeBpmAnalyzer=new f;this.stopped=!1;this.aggregate=h(),this.port.addEventListener("message",this.onMessage.bind(this)),this.port.start()}onMessage(e){e.data.message==="ASYNC_CONFIGURATION"&&(console.log("[processor.onMessage] ASYNC_CONFIGURATION"),this.realTimeBpmAnalyzer.setAsyncConfiguration(e.data.parameters)),e.data.message==="RESET"&&(console.log("[processor.onMessage] RESET"),this.aggregate=h(),this.stopped=!1,this.realTimeBpmAnalyzer.reset()),e.data.message==="STOP"&&(console.log("[processor.onMessage] STOP"),this.aggregate=h(),this.stopped=!0,this.realTimeBpmAnalyzer.reset())}process(e,r,t){let a=e[0][0];if(this.stopped||!a)return!0;let{isBufferFull:o,buffer:i,bufferSize:l}=this.aggregate(a);return o&&this.realTimeBpmAnalyzer.analyzeChunck(i,sampleRate,l,d=>{this.port.postMessage(d)}).catch(d=>{console.error(d)}),!0}};registerProcessor(A,x);var K={};})();
//# sourceMappingURL=realtime-bpm-processor.js.map
`;
