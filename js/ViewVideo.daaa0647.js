(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["ViewVideo"],{"057f":function(t,e,n){var r=n("fc6a"),o=n("241c").f,i={}.toString,a="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],s=function(t){try{return o(t)}catch(e){return a.slice()}};t.exports.f=function(t){return a&&"[object Window]"==i.call(t)?s(t):o(r(t))}},1148:function(t,e,n){"use strict";var r=n("a691"),o=n("1d80");t.exports="".repeat||function(t){var e=String(o(this)),n="",i=r(t);if(i<0||i==1/0)throw RangeError("Wrong number of repetitions");for(;i>0;(i>>>=1)&&(e+=e))1&i&&(n+=e);return n}},"159b":function(t,e,n){var r=n("da84"),o=n("fdbc"),i=n("17c2"),a=n("9112");for(var s in o){var c=r[s],u=c&&c.prototype;if(u&&u.forEach!==i)try{a(u,"forEach",i)}catch(f){u.forEach=i}}},"17c2":function(t,e,n){"use strict";var r=n("b727").forEach,o=n("a640"),i=n("ae40"),a=o("forEach"),s=i("forEach");t.exports=a&&s?[].forEach:function(t){return r(this,t,arguments.length>1?arguments[1]:void 0)}},2232:function(t,e,n){"use strict";n.d(e,"b",(function(){return r})),n.d(e,"a",(function(){return o}));var r="0x6915Ae0D5a9c08675Ce5c83b54228f3D3F1A6101",o=[{constant:!1,inputs:[{name:"_addr",type:"address"}],name:"tip",outputs:[],payable:!0,stateMutability:"payable",type:"function"},{anonymous:!1,inputs:[{indexed:!0,name:"from",type:"address"},{indexed:!0,name:"to",type:"address"},{indexed:!1,name:"value",type:"uint256"}],name:"Tip",type:"event"},{constant:!0,inputs:[],name:"amount",outputs:[{name:"",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"}]},4160:function(t,e,n){"use strict";var r=n("23e7"),o=n("17c2");r({target:"Array",proto:!0,forced:[].forEach!=o},{forEach:o})},"4de4":function(t,e,n){"use strict";var r=n("23e7"),o=n("b727").filter,i=n("1dde"),a=n("ae40"),s=i("filter"),c=a("filter");r({target:"Array",proto:!0,forced:!s||!c},{filter:function(t){return o(this,t,arguments.length>1?arguments[1]:void 0)}})},5530:function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));n("a4d3"),n("4de4"),n("4160"),n("e439"),n("dbb4"),n("b64b"),n("159b");function r(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function o(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function i(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?o(Object(n),!0).forEach((function(e){r(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}},"746f":function(t,e,n){var r=n("428f"),o=n("5135"),i=n("e538"),a=n("9bf2").f;t.exports=function(t){var e=r.Symbol||(r.Symbol={});o(e,t)||a(e,t,{value:i.f(t)})}},8418:function(t,e,n){"use strict";var r=n("c04e"),o=n("9bf2"),i=n("5c6c");t.exports=function(t,e,n){var a=r(e);a in t?o.f(t,a,i(0,n)):t[a]=n}},"99af":function(t,e,n){"use strict";var r=n("23e7"),o=n("d039"),i=n("e8b5"),a=n("861d"),s=n("7b0b"),c=n("50c4"),u=n("8418"),f=n("65f0"),l=n("1dde"),b=n("b622"),d=n("2d00"),p=b("isConcatSpreadable"),m=9007199254740991,v="Maximum allowed index exceeded",y=d>=51||!o((function(){var t=[];return t[p]=!1,t.concat()[0]!==t})),h=l("concat"),g=function(t){if(!a(t))return!1;var e=t[p];return void 0!==e?!!e:i(t)},w=!y||!h;r({target:"Array",proto:!0,forced:w},{concat:function(t){var e,n,r,o,i,a=s(this),l=f(a,0),b=0;for(e=-1,r=arguments.length;e<r;e++)if(i=-1===e?a:arguments[e],g(i)){if(o=c(i.length),b+o>m)throw TypeError(v);for(n=0;n<o;n++,b++)n in i&&u(l,b,i[n])}else{if(b>=m)throw TypeError(v);u(l,b++,i)}return l.length=b,l}})},a4d3:function(t,e,n){"use strict";var r=n("23e7"),o=n("da84"),i=n("d066"),a=n("c430"),s=n("83ab"),c=n("4930"),u=n("fdbf"),f=n("d039"),l=n("5135"),b=n("e8b5"),d=n("861d"),p=n("825a"),m=n("7b0b"),v=n("fc6a"),y=n("c04e"),h=n("5c6c"),g=n("7c73"),w=n("df75"),O=n("241c"),j=n("057f"),_=n("7418"),x=n("06cf"),S=n("9bf2"),C=n("d1e7"),P=n("9112"),E=n("6eeb"),V=n("5692"),D=n("f772"),k=n("d012"),M=n("90e3"),A=n("b622"),N=n("e538"),q=n("746f"),T=n("d44e"),W=n("69f3"),J=n("b727").forEach,F=D("hidden"),R="Symbol",$="prototype",B=A("toPrimitive"),G=W.set,I=W.getterFor(R),Q=Object[$],z=o.Symbol,H=i("JSON","stringify"),K=x.f,L=S.f,U=j.f,X=C.f,Y=V("symbols"),Z=V("op-symbols"),tt=V("string-to-symbol-registry"),et=V("symbol-to-string-registry"),nt=V("wks"),rt=o.QObject,ot=!rt||!rt[$]||!rt[$].findChild,it=s&&f((function(){return 7!=g(L({},"a",{get:function(){return L(this,"a",{value:7}).a}})).a}))?function(t,e,n){var r=K(Q,e);r&&delete Q[e],L(t,e,n),r&&t!==Q&&L(Q,e,r)}:L,at=function(t,e){var n=Y[t]=g(z[$]);return G(n,{type:R,tag:t,description:e}),s||(n.description=e),n},st=u?function(t){return"symbol"==typeof t}:function(t){return Object(t)instanceof z},ct=function(t,e,n){t===Q&&ct(Z,e,n),p(t);var r=y(e,!0);return p(n),l(Y,r)?(n.enumerable?(l(t,F)&&t[F][r]&&(t[F][r]=!1),n=g(n,{enumerable:h(0,!1)})):(l(t,F)||L(t,F,h(1,{})),t[F][r]=!0),it(t,r,n)):L(t,r,n)},ut=function(t,e){p(t);var n=v(e),r=w(n).concat(pt(n));return J(r,(function(e){s&&!lt.call(n,e)||ct(t,e,n[e])})),t},ft=function(t,e){return void 0===e?g(t):ut(g(t),e)},lt=function(t){var e=y(t,!0),n=X.call(this,e);return!(this===Q&&l(Y,e)&&!l(Z,e))&&(!(n||!l(this,e)||!l(Y,e)||l(this,F)&&this[F][e])||n)},bt=function(t,e){var n=v(t),r=y(e,!0);if(n!==Q||!l(Y,r)||l(Z,r)){var o=K(n,r);return!o||!l(Y,r)||l(n,F)&&n[F][r]||(o.enumerable=!0),o}},dt=function(t){var e=U(v(t)),n=[];return J(e,(function(t){l(Y,t)||l(k,t)||n.push(t)})),n},pt=function(t){var e=t===Q,n=U(e?Z:v(t)),r=[];return J(n,(function(t){!l(Y,t)||e&&!l(Q,t)||r.push(Y[t])})),r};if(c||(z=function(){if(this instanceof z)throw TypeError("Symbol is not a constructor");var t=arguments.length&&void 0!==arguments[0]?String(arguments[0]):void 0,e=M(t),n=function(t){this===Q&&n.call(Z,t),l(this,F)&&l(this[F],e)&&(this[F][e]=!1),it(this,e,h(1,t))};return s&&ot&&it(Q,e,{configurable:!0,set:n}),at(e,t)},E(z[$],"toString",(function(){return I(this).tag})),E(z,"withoutSetter",(function(t){return at(M(t),t)})),C.f=lt,S.f=ct,x.f=bt,O.f=j.f=dt,_.f=pt,N.f=function(t){return at(A(t),t)},s&&(L(z[$],"description",{configurable:!0,get:function(){return I(this).description}}),a||E(Q,"propertyIsEnumerable",lt,{unsafe:!0}))),r({global:!0,wrap:!0,forced:!c,sham:!c},{Symbol:z}),J(w(nt),(function(t){q(t)})),r({target:R,stat:!0,forced:!c},{for:function(t){var e=String(t);if(l(tt,e))return tt[e];var n=z(e);return tt[e]=n,et[n]=e,n},keyFor:function(t){if(!st(t))throw TypeError(t+" is not a symbol");if(l(et,t))return et[t]},useSetter:function(){ot=!0},useSimple:function(){ot=!1}}),r({target:"Object",stat:!0,forced:!c,sham:!s},{create:ft,defineProperty:ct,defineProperties:ut,getOwnPropertyDescriptor:bt}),r({target:"Object",stat:!0,forced:!c},{getOwnPropertyNames:dt,getOwnPropertySymbols:pt}),r({target:"Object",stat:!0,forced:f((function(){_.f(1)}))},{getOwnPropertySymbols:function(t){return _.f(m(t))}}),H){var mt=!c||f((function(){var t=z();return"[null]"!=H([t])||"{}"!=H({a:t})||"{}"!=H(Object(t))}));r({target:"JSON",stat:!0,forced:mt},{stringify:function(t,e,n){var r,o=[t],i=1;while(arguments.length>i)o.push(arguments[i++]);if(r=e,(d(e)||void 0!==t)&&!st(t))return b(e)||(e=function(t,e){if("function"==typeof r&&(e=r.call(this,t,e)),!st(e))return e}),o[1]=e,H.apply(null,o)}})}z[$][B]||P(z[$],B,z[$].valueOf),T(z,R),k[F]=!0},b64b:function(t,e,n){var r=n("23e7"),o=n("7b0b"),i=n("df75"),a=n("d039"),s=a((function(){i(1)}));r({target:"Object",stat:!0,forced:s},{keys:function(t){return i(o(t))}})},c8c8:function(t,e,n){t.exports=n.p+"img/thundercore-logo.325e1c56.svg"},dbb4:function(t,e,n){var r=n("23e7"),o=n("83ab"),i=n("56ef"),a=n("fc6a"),s=n("06cf"),c=n("8418");r({target:"Object",stat:!0,sham:!o},{getOwnPropertyDescriptors:function(t){var e,n,r=a(t),o=s.f,u=i(r),f={},l=0;while(u.length>l)n=o(r,e=u[l++]),void 0!==n&&c(f,e,n);return f}})},e010:function(t,e,n){},e439:function(t,e,n){var r=n("23e7"),o=n("d039"),i=n("fc6a"),a=n("06cf").f,s=n("83ab"),c=o((function(){a(1)})),u=!s||c;r({target:"Object",stat:!0,forced:u,sham:!s},{getOwnPropertyDescriptor:function(t,e){return a(i(t),e)}})},e538:function(t,e,n){var r=n("b622");e.f=r},f55c:function(t,e,n){"use strict";n.r(e);var r=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("v-ons-page",{attrs:{id:"viewStreamPage"}},[r("base-video",{ref:"videoplayer",attrs:{options:t.videoOptions},scopedSlots:t._u([{key:"top",fn:function(){return[r("div",{staticClass:"stream__controls stream__controls--top"},[r("v-ons-button",{staticClass:"btn btn--small btn--opacity-soft   flex-center-xy"},[r("base-icon",{staticClass:"btn__icon",attrs:{name:"user"}}),r("span",{staticClass:"ml-2"},[t._v("101")])],1),r("div",{staticClass:"ml-auto flex"},[r("v-ons-button",{staticClass:"btn btn--square  btn--opacity-soft btn--small ",on:{click:function(e){t.reportConfirm=!0}}},[r("base-icon",{staticClass:"btn__icon",attrs:{name:"flag"}})],1),r("div",{staticClass:"flex-column ml-2"},[r("v-ons-button",{staticClass:"btn btn--small btn--opacity-soft btn--square mb-2",on:{click:t.endViewingVideo}},[r("base-icon",{staticClass:"btn__icon",attrs:{name:"times"}})],1),r("v-ons-button",{staticClass:"btn btn--small  btn--opacity-soft btn--square mb-2",on:{click:t.dropVideoMenu}},[r("base-icon",{staticClass:"btn__icon",attrs:{name:"menu-dots"}})],1),r("transition",{attrs:{name:"vide-menu"}},[r("div",{directives:[{name:"show",rawName:"v-show",value:t.isVideoMenuDropped,expression:"isVideoMenuDropped"}],staticClass:"video__controls__menu flex-column"},[r("v-ons-button",{staticClass:"btn btn--square  btn--opacity-soft btn--small  mb-2"},[r("base-icon",{staticClass:"btn__icon",attrs:{name:"shopping-cart"}})],1)],1)])],1)],1)],1)]},proxy:!0},{key:"bottom",fn:function(){return[r("div",{staticClass:"stream__controls stream__controls--bottom",staticStyle:{bottom:"2.2rem"}},[r("div",{staticClass:"flex-column stream-detail"},[r("h5",{staticClass:"stream-detail__title"},[t._v(" details ")]),r("p",{staticClass:"stream-detail__hashtag"},[t._v(" hashtags ")])]),r("div",{staticClass:" ml-auto flex-column "},[r("a",{staticClass:"btn-tip mb-2",on:{click:function(e){return e.preventDefault(),t.tipStreamer()}}},[r("img",{attrs:{src:n("c8c8")}})])])])]},proxy:!0}])})],1)},o=[],i=(n("96cf"),n("1da1")),a=n("5530"),s=n("1311"),c=n("bac7"),u=n.n(c),f=n("2232"),l=n("2f62"),b=n("e510"),d=Object(l["a"])("requests"),p=d.mapGetters,m={name:"ViewVideo",components:{BaseVideo:s["a"]},data:function(){return{player:null,videoOptions:{controls:["play-large","progress","current-time","mute","settings"],settings:["speed","loop"]},isVideoMenuDropped:!1}},methods:Object(a["a"])(Object(a["a"])({},p(["getSelectedPin","myWalletAddress"])),{},{endViewingVideo:function(){this.$router.push({path:"/"})},dropVideoMenu:function(){this.isVideoMenuDropped=!this.isVideoMenuDropped},tipStreamer:function(){var t=this;return Object(i["a"])(regeneratorRuntime.mark((function e(){var n,r,o,i;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return n=1,r=new u.a(window.web3.currentProvider),Object(b["a"])(r),e.next=5,window.web3.eth.contract(f["a"]);case 5:return o=e.sent,e.next=8,o.at(f["b"]);case 8:return i=e.sent,Object(b["a"])(o),Object(b["a"])(i),e.next=13,i.tip(t._getStreamerWalletAddress(),{gas:3e5,gasPrice:"0x14f46b0400",value:window.web3.toWei(String(n),"ether"),from:t.$store.state.web3.coinbase},(function(t){t&&Object(b["a"])(t)}));case 13:case"end":return e.stop()}}),e)})))()}})},v=m,y=(n("fbf7"),n("2877")),h=Object(y["a"])(v,r,o,!1,null,null,null);e["default"]=h.exports},fbf7:function(t,e,n){"use strict";n("e010")}}]);
//# sourceMappingURL=ViewVideo.daaa0647.js.map