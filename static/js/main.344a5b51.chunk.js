(this["webpackJsonpreverse-ens"]=this["webpackJsonpreverse-ens"]||[]).push([[0],{267:function(e,r){},290:function(e,r){},292:function(e,r){},368:function(e,r){},370:function(e,r){},402:function(e,r){},407:function(e,r){},409:function(e,r){},416:function(e,r){},429:function(e,r){},447:function(e,r){},458:function(e,r){},461:function(e,r){},517:function(e,r,t){"use strict";t.r(r);var n=t(1),s=t.n(n),a=t(239),c=t.n(a),o=t(528),u=t(19),i=t.n(u),d=t(53),l=t(41),f=t(10),v=t(240),b=t.n(v),h=t(105),p=t(536),x=t(529),w=t(534),m=t(531),O=t(532),j=t(533),g=t(535),R=t(243),k=t(17),A=void 0,y=window.ethereum,N=new b.a(y),S=function(e){return function(){for(var r=arguments.length,t=new Array(r),n=0;n<r;n++)t[n]=arguments[n];t[0]="%c ".concat(t[0]," "),t.splice(1,0,e),console.log.apply(A,t)}},C=function(){var e=new h.a,r=Object(n.useState)("subdomain.ensname.eth"),t=Object(f.a)(r,2),s=t[0],a=t[1],c=Object(n.useState)({self:"Your Address",net:"Current Network",revRegistrar:"Reverse Registrar Address",rev:"Reverse Address",owner:null,address:null,revOwner:"Reverse Lookup Owner",resolver:"Resolver Address",revName:"Reverse Lookup"}),u=Object(f.a)(c,2),v=u[0],b=u[1],A=Object(n.useState)({}),C=Object(f.a)(A,2),E=C[0],I=C[1],M=Object(n.useState)({}),L=Object(f.a)(M,2),W=L[0],$=L[1],q=function(e){I((function(r){return Object(l.a)(Object(l.a)({},r),e)}))},J=function(e){$((function(r){return Object(l.a)(Object(l.a)({},r),e)}))},T=function(){I({}),$({})};null===y||void 0===y||y.on("chainChanged",T),null===y||void 0===y||y.on("accountsChanged",(function(e){T(),q({self:e[0]})})),Object(n.useEffect)((function(){b((function(e){return Object(l.a)(Object(l.a)({},e),{},{owner:"".concat(s," Owner"),address:"".concat(s," Address")})})),I((function(e){return Object(l.a)(Object(l.a)({},e),{},{owner:void 0,address:void 0})}))}),[s]);var U=[{name:"Install MetaMask",func:function(){return e.startOnboarding()},if:function(){return!h.a.isMetaMaskInstalled()}},{name:"Stop Onboarding",func:function(){try{e.stopOnboarding()}catch(r){console.warn(r)}},if:function(){return!h.a.isMetaMaskInstalled()}},{name:"Connect To Ethereum Wallet",func:function(){var e=Object(d.a)(i.a.mark((function e(){var r,t,n;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return(r=S("color: purple"))("Enabling Inpage Provider"),e.next=4,null===y||void 0===y?void 0:y.request({method:"eth_requestAccounts"});case 4:t=e.sent,n=null===t||void 0===t?void 0:t[0],r("Wallet Address",n),q({self:n});case 8:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),if:function(){return!!y&&!E.self}},{name:"Load Addresses",func:function(){var e=Object(d.a)(i.a.mark((function e(){var r,t,n,a,c,o,u,l;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=S("color: orange; background-color: purple"),e.next=3,Object(d.a)(i.a.mark((function e(){var r;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,N.eth.getChainId();case 2:r=e.sent,e.t0=r,e.next=1===e.t0?6:2===e.t0?7:3===e.t0?8:4===e.t0?9:42===e.t0?10:100===e.t0?11:12;break;case 6:return e.abrupt("return","mainnet");case 7:return e.abrupt("return","Morden");case 8:return e.abrupt("return","Ropsten");case 9:return e.abrupt("return","Rinkeby");case 10:return e.abrupt("return","Kovan");case 11:return e.abrupt("return","xDAI");case 12:return e.abrupt("return","unknown (id:".concat(r,")"));case 13:case"end":return e.stop()}}),e)})))();case 3:if(t=e.sent,r("Setting addrs.net",t),q({net:t}),E.self){e.next=8;break}throw new Error("Wallet Address Not Set");case 8:return n="".concat(E.self.substr(2),".addr.reverse"),r("Adding Reverse Address",n),q({rev:n}),r("Looking Up addr.reverse Owner"),e.next=14,N.eth.ens.getOwner("addr.reverse");case 14:if(a=e.sent,r("revReg",a),a){e.next=18;break}throw new Error("Couldn't resolve reverse registrar.");case 18:return r("revReg",a),q({revRegistrar:a}),e.next=22,N.eth.ens.getOwner(n);case 22:return c=e.sent,q({revOwner:c}),e.next=26,N.eth.ens.getResolver(s);case 26:if(o=e.sent,!/^0x0+$/.test(o.options.address)){e.next=33;break}q({address:u=Object(k.jsx)("em",{children:"Unset"})}),q({owner:u}),e.next=43;break;case 33:return e.next=35,N.eth.ens.getAddress(s);case 35:return l=e.sent,q({address:l}),e.t0=q,e.next=40,N.eth.ens.getOwner(l);case 40:e.t1=e.sent,e.t2={owner:e.t1},(0,e.t0)(e.t2);case 43:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),if:function(){return!!E.self&&(!E.net||!E.address||!E.owner)}},{name:"Load Contracts",func:function(){var e=Object(d.a)(i.a.mark((function e(){var r,t,n,s,a,c,o;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(r=S("color: lightgray; background-color: black"),E.revRegistrar){e.next=3;break}throw new Error("Reverse Registrar Address Not Set");case 3:return t=new N.eth.Contract(R.a,E.revRegistrar),r("Reverse Registrar",t.options.address),J({revRegistrar:t}),e.next=8,t.methods.defaultResolver().call();case 8:if(n=e.sent,q({defaultResolver:n}),E.rev){e.next=12;break}throw new Error("Reverse Address Is Not Set");case 12:return e.next=14,N.eth.ens.getResolver(E.rev);case 14:if(s=e.sent,J({revResolver:s}),a=s.options.address,q({resolver:a}),!/^0x0+$/.test(a)){e.next=22;break}q({revName:void 0}),e.next=29;break;case 22:return e.next=24,t.methods.node(E.self).call();case 24:return c=e.sent,e.next=27,s.methods.name(c).call();case 27:o=e.sent,q({revName:o});case 29:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),if:function(){return!!E.revRegistrar&&!W.revRegistrar}},{name:"Claim the Reverse Address",func:function(){var e=Object(d.a)(i.a.mark((function e(){var r,t;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(E.revOwner===E.self){e.next=9;break}return e.next=3,null===(r=W.revRegistrar)||void 0===r?void 0:r.methods.claim(E.self).send({from:E.self});case 3:if(E.rev){e.next=5;break}throw new Error("Missing Reverse Address");case 5:return e.next=7,N.eth.ens.getOwner(E.rev);case 7:t=e.sent,q({revOwner:t});case 9:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),if:function(){var e;return/^0x0+$/.test(null!==(e=E.revOwner)&&void 0!==e?e:"")&&!!W.revRegistrar}},{name:"Link Reverse Name",func:function(){var e=Object(d.a)(i.a.mark((function e(){var r,t;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(E.revName!==s){e.next=2;break}return e.abrupt("return",alert("Reverse Already Set To: ".concat(s)));case 2:if(E.revName&&!window.confirm("Overwrite ".concat(E.revName,"?"))){e.next=16;break}if(W.revRegistrar){e.next=5;break}throw new Error("Reverse Registrar Not Set");case 5:return e.next=7,W.revRegistrar.methods.setName(s).send({from:E.self});case 7:if(W.revResolver){e.next=9;break}throw new Error("Reverse Resolver Not Set");case 9:return e.next=11,W.revRegistrar.methods.node(E.self).call();case 11:return r=e.sent,e.next=14,W.revResolver.methods.name(r).call();case 14:t=e.sent,q({revName:t});case 16:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),if:function(){var e;return!/^0x0+$/.test(null!==(e=E.revOwner)&&void 0!==e?e:"")&&!!W.revResolver&&!!W.revRegistrar}}];return Object(k.jsxs)(o.a,{children:[Object(k.jsxs)(p.a,{children:[Object(k.jsx)(x.a,{justify:"center",children:Object(k.jsx)(w.a,{textAlign:"right",value:s,onChange:function(e){return a(e.target.value)}})}),Object(k.jsx)(m.a,{templateColumns:"auto 1fr",alignItems:"center",children:Object.entries(v).map((function(e,r){var t=Object(f.a)(e,2),n=t[0],s=t[1];return Object(k.jsxs)(O.a,{display:"contents",sx:{"&:hover > *":{bg:"yellow"}},children:[Object(k.jsxs)(j.a,{m:0,textAlign:"right",pr:5,minW:"12em",children:[s,":"]}),Object(k.jsx)(j.a,{m:0,textOverflow:"clip",title:E[n],children:Object(k.jsx)("code",{children:E[n]})})]},r)}))})]}),Object(k.jsx)(p.a,{children:U.map((function(e,r){return Object(k.jsx)(g.a,{onClick:function(){try{e.func()}catch(r){console.error(r),alert(r.message)}},disabled:!!e.if&&!e.if(),m:0,py:10,mt:"0 ! important",children:e.name},r)}))})]})},E=function(){return Object(k.jsx)(o.a,{className:"App",children:Object(k.jsx)(C,{})})};c.a.render(Object(k.jsx)(s.a.StrictMode,{children:Object(k.jsx)(E,{})}),document.getElementById("root"))}},[[517,1,2]]]);
//# sourceMappingURL=main.344a5b51.chunk.js.map