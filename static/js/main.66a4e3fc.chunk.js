(this["webpackJsonpreverse-ens"]=this["webpackJsonpreverse-ens"]||[]).push([[0],{325:function(e,r){},348:function(e,r){},350:function(e,r){},426:function(e,r){},428:function(e,r){},460:function(e,r){},465:function(e,r){},467:function(e,r){},474:function(e,r){},487:function(e,r){},505:function(e,r){},516:function(e,r){},519:function(e,r){},578:function(e,r,t){"use strict";t.r(r);var n=t(0),s=t.n(n),a=t(57),o=t.n(a),c=t(609),i=t(177),u=t(25),l=t(31),d=t.n(l),f=t(98),v=t(62),h=t(5),b=t(283),m=t.n(b),j=t(179),p=t(603),x=t(604),w=t(593),O=t(606),g=t(594),k=t(595),R=t(605),y=t(597),A=t(598),S=t(599),C=t(602),N=t(610),E=t(600),T=t(286),I=t(611),W=t(20),M=void 0,q=window.ethereum,F=new m.a(q),z=function(e){return function(){for(var r=arguments.length,t=new Array(r),n=0;n<r;n++)t[n]=arguments[n];t[0]="%c ".concat(t[0]," "),t.splice(1,0,e),console.log.apply(M,t)}},B={self:"This is the address of your wallet. The reverse record is an ENS name that is returned when users search on this address. There is only one reverse record per address.",net:"The currently selected ethereum chain. In general ENS resolution is done on the mainnet, but instances exist on some of the test chains as well.",registrar:"This is the contract that controls name registration for the reverse records.",reverse:"This is a specially formatted address that is used to look up your reverse record.",address:"The forward resolution for the currently selected name to use for the reverse record. There is no technical requirement that this resolve to your wallet address, but if it doesn't, many implementations will disregard the record.",resolver:"This is the contract address for the resolver for the resolution of reverse entries.",owner:"When you create a reverse entry, you are set as the owner of the reverse address.",name:"This is the currently configured reverse record for your wallet address."},D=function(){var e=new j.a,r=Object(u.f)(),t=Object(n.useState)(r.name),s=Object(h.a)(t,2),a=s[0],o=s[1],c=Object(n.useState)({self:"Your Address",net:"Current Network",registrar:"Reverse Registrar Address",reverse:"Reverse Address",resolver:"Resolver Address",address:null,owner:"Reverse Lookup Owner",name:"Current Reverse"}),i=Object(h.a)(c,2),l=i[0],b=i[1],m=Object(n.useState)({}),M=Object(h.a)(m,2),D=M[0],J=M[1],L=Object(n.useState)({}),U=Object(h.a)(L,2),$=U[0],K=U[1],P=Object(n.useState)(!1),V=Object(h.a)(P,2),X=V[0],Y=V[1],_=Object(p.a)(),G=Object(x.a)(["bottom","right"]),H=Object(n.useRef)(null),Q=function(e){J((function(r){return Object(v.a)(Object(v.a)({},r),e)}))},Z=function(e){K((function(r){return Object(v.a)(Object(v.a)({},r),e)}))},ee=function(){J({}),K({})};Object(n.useEffect)((function(){return null===q||void 0===q||q.on("chainChanged",ee),function(){return null===q||void 0===q?void 0:q.off("chainChanged",ee)}}),[]),Object(n.useEffect)((function(){var e=function(e){ee(),Q({self:e[0]})};return null===q||void 0===q||q.on("accountsChanged",e),function(){return null===q||void 0===q?void 0:q.off("accountsChanged",e)}}),[]),Object(n.useEffect)((function(){b((function(e){return Object(v.a)(Object(v.a)({},e),{},{address:a?"".concat(a,"'s Address"):null})})),J((function(e){return Object(v.a)(Object(v.a)({},e),{},{address:void 0})}))}),[a]);var re=[{name:"Install MetaMask",func:function(){return e.startOnboarding()},if:function(){return!j.a.isMetaMaskInstalled()}},{name:"Connect Ethereum Wallet",func:function(){var e=Object(f.a)(d.a.mark((function e(){var r,t,n;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return(r=z("color: purple"))("Enabling Inpage Provider"),e.next=4,null===q||void 0===q?void 0:q.request({method:"eth_requestAccounts"});case 4:t=e.sent,n=null===t||void 0===t?void 0:t[0],r("Wallet Address",n),Q({self:n});case 8:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),if:function(){return!!q&&!D.self}},{name:"Load Contracts",func:function(){var e=Object(f.a)(d.a.mark((function e(){var r,t,n,s,c,i,u,l,v,h,b,m,j,p;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=z("color: orange; background-color: purple"),e.next=3,Object(f.a)(d.a.mark((function e(){var r;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,F.eth.getChainId();case 2:r=e.sent,e.t0=r,e.next=1===e.t0?6:2===e.t0?7:3===e.t0?8:4===e.t0?9:42===e.t0?10:100===e.t0?11:12;break;case 6:return e.abrupt("return","mainnet");case 7:return e.abrupt("return","Morden");case 8:return e.abrupt("return","Ropsten");case 9:return e.abrupt("return","Rinkeby");case 10:return e.abrupt("return","Kovan");case 11:return e.abrupt("return","xDAI");case 12:return e.abrupt("return","unknown (id:".concat(r,")"));case 13:case"end":return e.stop()}}),e)})))();case 3:if(t=e.sent,r("Setting Network Name",t),Q({net:t}),D.self){e.next=8;break}throw new Error("Wallet Address Not Set");case 8:return n="".concat(D.self.substr(2),".addr.reverse"),r("Adding Reverse Address",n),Q({reverse:n}),e.next=13,F.eth.ens.getOwner("addr.reverse");case 13:if(s=e.sent,r("Reverse Registrar",s),s&&!/^0x0+$/.test(s)){e.next=17;break}throw new Error("Couldn't Resolve Reverse Registrar");case 17:if(Q({registrar:s}),e.prev=18,a){e.next=21;break}throw new Error("Name Not Set");case 21:return e.next=23,F.eth.ens.getAddress(a);case 23:return c=e.sent,e.t0=Q,e.t1=c,e.next=28,F.eth.ens.getOwner(n);case 28:e.t2=e.sent,e.t3={address:e.t1,owner:e.t2},(0,e.t0)(e.t3),e.next=40;break;case 33:if(e.prev=33,e.t4=e.catch(18),!e.t4.message.includes("does not implement requested method")&&!e.t4.message.includes("Name Not Set")){e.next=39;break}Q({address:null,owner:null}),e.next=40;break;case 39:throw e.t4;case 40:if(s){e.next=42;break}throw new Error("Reverse Registrar Address Not Set");case 42:if(i=new F.eth.Contract(T.a,s),r("Reverse Registrar",i.options.address),Z({registrar:i}),n){e.next=47;break}throw new Error("Reverse Address Is Not Set");case 47:return e.next=49,F.eth.ens.getResolver(n);case 49:if(u=e.sent,Z({reverseResolver:u}),l=u.options.address,Q({resolver:l}),v=a,!/^0x0+$/.test(l)){e.next=58;break}Q({name:null}),e.next=75;break;case 58:return e.next=60,i.methods.node(D.self).call();case 60:return b=e.sent,e.next=63,u.methods.name(b).call();case 63:if(e.t6=h=e.sent,e.t5=null!==e.t6,!e.t5){e.next=67;break}e.t5=void 0!==h;case 67:if(!e.t5){e.next=71;break}e.t7=h,e.next=72;break;case 71:e.t7=null;case 72:m=e.t7,Q({name:m}),a||(v=m,o(m),_({title:"Set Name",description:'Defaulting name to current reverse record: "'.concat(m,'".'),duration:3e3}),null===(j=H.current)||void 0===j||j.focus());case 75:if(!v){e.next=80;break}return e.next=78,F.eth.ens.getResolver(v);case 78:p=e.sent,Z({resolver:p});case 80:case"end":return e.stop()}}),e,null,[[18,33]])})));return function(){return e.apply(this,arguments)}}(),if:function(){return!!D.self&&[D.net,D.reverse,D.registrar,D.address,D.owner,D.name,$.resolver,$.registrar,$.reverseResolver].some((function(e){return void 0===e}))}},{name:a?"Set ".concat(a," As Reverse"):"Enter A Name To Use As Reverse",func:function(){var e=Object(f.a)(d.a.mark((function e(){var r;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(a&&D.name!==a){e.next=3;break}return a&&alert("Reverse Already Set To: ".concat(a)),e.abrupt("return",null===(r=H.current)||void 0===r?void 0:r.focus());case 3:if(D.name&&!window.confirm("Overwrite ".concat(D.name,"?"))){e.next=12;break}if($.registrar){e.next=6;break}throw new Error("Reverse Registrar Contract Not Set");case 6:return Y(!0),e.next=9,$.registrar.methods.setName(a).send({from:D.self});case 9:Z({resolver:void 0}),Q({name:void 0,owner:void 0}),Y(!1);case 12:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),if:function(){return![D.net,D.reverse,D.registrar,D.address,D.owner,D.name,$.resolver,$.registrar,$.reverseResolver].some((function(e){return void 0===e}))}}];return Object(W.jsxs)(w.a,{maxW:"100%",children:[Object(W.jsxs)(O.a,{children:[Object(W.jsxs)(g.a,{justify:"center",justifyItems:"center",children:[Object(W.jsx)(k.a,{m:0,mr:2,alignSelf:"center",children:"ENS Name For Reverse Record:"}),Object(W.jsx)(R.a,{w:"auto",textAlign:"center",placeholder:"Exe: sample.ens.eth",value:null!==a&&void 0!==a?a:"",ref:H,onChange:function(e){o(e.target.value),Q({address:void 0}),Z({resolver:void 0})}})]}),Object(W.jsx)(y.a,{templateColumns:["auto","auto 1fr"],alignItems:"center",maxW:"100vw",children:Object.entries(l).map((function(e,r){var t,n=Object(h.a)(e,2),s=n[0],a=n[1],o=Object(A.a)(null!==(t=D[s])&&void 0!==t?t:"").onCopy;return a?Object(W.jsxs)(S.a,{display:"contents",sx:{"&:hover > *":{bg:"#FBFF0522"}},children:[Object(W.jsx)(C.a,{hasArrow:!0,placement:G,label:B[s],children:Object(W.jsxs)(k.a,{textAlign:["left","right"],m:0,pr:5,minW:"12em",userSelect:"none",children:[a,":"]})}),Object(W.jsxs)(k.a,{m:0,textOverflow:"clip",whiteSpace:"nowrap",title:D[s],overflowX:"hidden",ml:[5,0],children:[D[s]&&Object(W.jsx)(N.a,{title:"Copy",mr:2,size:"xs",onClick:function(){o(),_({title:"Value Copied",duration:1500})},children:Object(W.jsx)(I.a,{})}),Object(W.jsx)("code",{children:null===D[s]?Object(W.jsx)("em",{children:"Unset"}):D[s]})]})]},r):null}))})]}),Object(W.jsx)(O.a,{children:re.map((function(e,r){return Object(W.jsxs)(N.a,{onClick:Object(f.a)(d.a.mark((function r(){return d.a.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return r.prev=0,r.next=3,e.func();case 3:r.next=10;break;case 5:r.prev=5,r.t0=r.catch(0),console.error(r.t0),alert(r.t0.message),Y(!1);case 10:case"end":return r.stop()}}),r,null,[[0,5]])}))),disabled:X||!!e.if&&!e.if(),m:0,mt:"0 ! important",children:[X&&r+1===re.length&&Object(W.jsx)(E.a,{size:"sm",mr:3}),e.name]},r)}))})]})},J=function(){return Object(W.jsx)(i.a,{children:Object(W.jsx)(u.c,{children:Object(W.jsx)(u.a,{path:"/:name?",component:D})})})};o.a.render(Object(W.jsx)(s.a.StrictMode,{children:Object(W.jsx)(c.a,{children:Object(W.jsx)(J,{})})}),document.getElementById("root"))}},[[578,1,2]]]);
//# sourceMappingURL=main.66a4e3fc.chunk.js.map