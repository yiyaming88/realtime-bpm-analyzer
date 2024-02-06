export default `"use strict";(()=>{var T="realtime-bpm-processor";async function p(n,o=.2,e=.95,s=.05){let t=e;do if(t-=s,await n(t))break;while(t>o)}function A(n=.2,o=.95,e=.05){let s={},t=o;do t-=e,s[t.toString()]=[];while(t>n);return s}function y(n=.2,o=.95,e=.05){let s={},t=o;do t-=e,s[t.toString()]=0;while(t>n);return s}function m(){let o=0,e=new Float32Array(0);function s(){o=0,e=new Float32Array(0)}function t(){return o===4096}function a(){s()}return function(r){t()&&a();let l=new Float32Array(e.length+r.length);return l.set(e,0),l.set(r,e.length),e=l,o+=r.length,{isBufferFull:t(),buffer:e,bufferSize:4096}}}function v(n,o,e=0,s=1e4){let t=[],{length:a}=n;for(let r=e;r<a;r+=1)n[r]>o&&(t.push(r),r+=s);return{peaks:t,threshold:o}}async function b(n,o){let e=15,s=!1,t=.2;if(await p(async a=>s?!0:(n[a].length>e&&(s=!0,t=a),!1)),s&&t){let a=V(n[t]),r=S(o,a);return{bpm:w(r),threshold:t}}return{bpm:[],threshold:t}}function w(n,o=5){return n.sort((e,s)=>s.count-e.count).splice(0,o)}function V(n){let o=[];for(let e=0;e<n.length;e++)for(let s=0;s<10;s++){let t=n[e],a=e+s,r=n[a]-t;if(!o.some(i=>i.interval===r?(i.count+=1,i.count):!1)){let i={interval:r,count:1};o.push(i)}}return o}function S(n,o){let e=[];for(let s of o){if(s.interval===0)continue;s.interval=Math.abs(s.interval);let t=60/(s.interval/n);for(;t<90;)t*=2;for(;t>180;)t/=2;if(t=Math.round(t),!e.some(r=>r.tempo===t?(r.count+=s.count,r.count):!1)){let r={tempo:t,count:s.count,confidence:0};e.push(r)}}return e}var d={minValidThreshold:()=>.2,validPeaks:()=>A(),nextIndexPeaks:()=>y(),skipIndexes:()=>1,effectiveBufferTime:()=>0},f=class{constructor(o={}){this.options={continuousAnalysis:!1,stabilizationTime:2e4,muteTimeInIndexes:1e4,debug:!1};this.minValidThreshold=d.minValidThreshold();this.validPeaks=d.validPeaks();this.nextIndexPeaks=d.nextIndexPeaks();this.skipIndexes=d.skipIndexes();this.effectiveBufferTime=d.effectiveBufferTime();this.computedStabilizationTimeInSeconds=0;Object.assign(this.options,o),this.updateComputedValues()}updateComputedValues(){this.computedStabilizationTimeInSeconds=this.options.stabilizationTime/1e3}reset(){this.minValidThreshold=d.minValidThreshold(),this.validPeaks=d.validPeaks(),this.nextIndexPeaks=d.nextIndexPeaks(),this.skipIndexes=d.skipIndexes(),this.effectiveBufferTime=d.effectiveBufferTime()}async clearValidPeaks(o){this.minValidThreshold=Number.parseFloat(o.toFixed(2)),await p(async e=>(e<o&&this.validPeaks[e]!==void 0&&(delete this.validPeaks[e],delete this.nextIndexPeaks[e]),!1))}async analyzeChunck(o,e,s,t){this.options.debug&&t({message:"ANALYZE_CHUNK",data:o}),this.effectiveBufferTime+=s;let a=s*this.skipIndexes,r=a-s;await this.findPeaks(o,s,r,a,t),this.skipIndexes++;let l=await b(this.validPeaks,e),{threshold:i}=l;t({message:"BPM",data:l}),this.minValidThreshold<i&&(t({message:"BPM_STABLE",data:l}),await this.clearValidPeaks(i)),this.options.continuousAnalysis&&this.effectiveBufferTime/e>this.computedStabilizationTimeInSeconds&&(this.reset(),t({message:"ANALYZER_RESETED"}))}async findPeaks(o,e,s,t,a){await p(async r=>{if(this.nextIndexPeaks[r]>=t)return!1;let l=this.nextIndexPeaks[r]%e,{peaks:i,threshold:c}=v(o,r,l);if(i.length===0)return!1;for(let B of i){let h=s+B;this.nextIndexPeaks[c]=h+this.options.muteTimeInIndexes,this.validPeaks[c].push(h),this.options.debug&&a({message:"VALID_PEAK",data:{threshold:c,index:h}})}return!1},this.minValidThreshold)}};var x=class extends AudioWorkletProcessor{constructor(e){super(e);this.stopped=!1;this.aggregate=m(),this.realTimeBpmAnalyzer=new f(e.processorOptions),this.port.addEventListener("message",this.onMessage.bind(this)),this.port.start()}onMessage(e){e.data.message==="RESET"&&(console.log("[processor.onMessage] RESET"),this.aggregate=m(),this.stopped=!1,this.realTimeBpmAnalyzer.reset()),e.data.message==="STOP"&&(console.log("[processor.onMessage] STOP"),this.aggregate=m(),this.stopped=!0,this.realTimeBpmAnalyzer.reset())}process(e,s,t){let a=e[0][0];if(this.stopped||!a)return!0;let{isBufferFull:r,buffer:l,bufferSize:i}=this.aggregate(a);return r&&this.realTimeBpmAnalyzer.analyzeChunck(l,sampleRate,i,c=>{this.port.postMessage(c)}).catch(c=>{console.error(c)}),!0}};registerProcessor(T,x);var _={};})();
//# sourceMappingURL=realtime-bpm-processor.js.map
`;
