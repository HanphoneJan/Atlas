import{d as e,u as a,r as l,m as t,a as s,e as o,b as n,h as u,w as d,p as r,F as c,y as i,l as m,k as v,o as p,g as h,i as f,v as _,q as g,j as k,t as y,_ as w,x as b,c as x,z as T,A as C,T as E}from"./index.js";import{E as A}from"./api.js";const I={class:"nav-container"},L={class:"search_input"},S={key:0,class:"search-suggestions"},V=["onClick"],j=w(e({__name:"NavBar",setup(e){const w=a(),b=l("1"),x=m(),T=l(!1),C=l(""),E=l([]);t((()=>{const e=document.documentElement.classList;"dark"===w.theme?(document.documentElement.classList.add("dark-theme"),e.add("dark")):(document.documentElement.classList.remove("dark-theme"),e.remove("dark"))}));const j={1:"/index",2:"/upload",3:"/blog",4:"/admin"},z=e=>{const a=j[e],l=a.slice(1);a?(x.push(a),w.changePage(l)):console.warn(`没有找到路由: ${e}`)},B=()=>{x.push("/login")},F=()=>{"dark"===w.theme?w.changeTheme("light"):w.changeTheme("dark")},N=async()=>{if(!C.value.trim())return E.value=[],void(T.value=!1);T.value=!0;try{E.value=await U(C.value)}catch(e){console.error("搜索错误:",e.message),E.value=[]}finally{T.value=!1}},U=async e=>{try{const a={query:e},l=await v.post(A.SEARCH,a);if(830===l.data.status){return Array.isArray(l.data.data)?l.data.data:[]}return[]}catch(a){return console.error("获取图集数据失败:",a.message),[]}},q=()=>{T.value=!0};let H;return(e,a)=>{const l=u("el-menu-item"),t=u("el-menu"),m=u("el-input"),v=u("el-button"),x=u("Moon"),A=u("el-icon"),j=u("Sunny");return p(),s("div",I,[o(t,{"default-active":b.value,class:"el-menu-demo",mode:"horizontal",onSelect:z},{default:d((()=>[o(l,{index:"1"},{default:d((()=>a[2]||(a[2]=[f("照片墙")]))),_:1}),o(l,{index:"2"},{default:d((()=>a[3]||(a[3]=[f("上传")]))),_:1}),o(l,{index:"3"},{default:d((()=>a[4]||(a[4]=[f("博客")]))),_:1}),h(o(l,{index:"4"},{default:d((()=>a[5]||(a[5]=[f("管理照片墙")]))),_:1},512),[[_,g(w).isAdmin]])])),_:1},8,["default-active"]),n("div",L,[o(m,{onFocus:q,onBlur:a[0]||(a[0]=e=>(clearTimeout(H),void(H=setTimeout((()=>{T.value=!1,E.value=[]}),200)))),class:"search",placeholder:"请输入内容","prefix-icon":"Search",modelValue:C.value,"onUpdate:modelValue":a[1]||(a[1]=e=>C.value=e),onInput:N,size:"small",clearable:""},null,8,["modelValue"]),!T.value&&E.value.length?(p(),s("ul",S,[(p(!0),s(c,null,i(E.value,(e=>(p(),s("li",{key:e.id,onClick:a=>{return l=e.path,window.location.href=l,T.value=!1,void(E.value=[]);var l}},[n("a",null,y(e.title),1)],8,V)))),128))])):r("",!0)]),o(v,{class:"login-button",onClick:B},{default:d((()=>a[6]||(a[6]=[f("登录")]))),_:1}),o(v,{class:"theme-toggle-button",onClick:F},{default:d((()=>["dark"===g(w).theme?(p(),k(A,{key:0,class:"is-loading"},{default:d((()=>[o(x)])),_:1})):(p(),k(A,{key:1,class:"is-loading"},{default:d((()=>[o(j)])),_:1}))])),_:1})])}}}),[["__scopeId","data-v-dab1b341"]]),z=w(e({__name:"Footer",setup(e){const a=l(0);return b((async()=>{try{const e=await v.get(A.VISITCOUNT);console.log(e.data),a.value=e.data.visitCount}catch(e){console.error("获取访问量失败:",e.message)}})),(e,l)=>{const t=u("el-footer");return p(),k(t,{class:"footer"},{default:d((()=>[n("span",null,"访问量: "+y(a.value),1)])),_:1})}}}),[["__scopeId","data-v-d77ac555"]]),B=w(e({__name:"Welcome",setup(e){const t=l(0),c=l(!1),i=x((()=>a().pageName)),m=()=>{t.value=window.scrollY||document.documentElement.scrollTop||document.body.scrollTop};return T(t,(e=>{c.value=e>100})),b((()=>{window.addEventListener("scroll",m)})),C((()=>{window.removeEventListener("scroll",m)})),(e,a)=>{const l=u("router-view"),t=u("el-main"),m=u("ArrowUpBold"),v=u("el-icon");return p(),s("div",null,[o(j),o(t,null,{default:d((()=>[o(l)])),_:1}),h(o(z,null,null,512),[[_,"index"===i.value]]),o(E,{name:"fade"},{default:d((()=>[c.value?(p(),s("p",{key:0,id:"back-top",onClick:a[0]||(a[0]=e=>{return a=0,void window.scrollTo({top:a,behavior:"smooth"});var a})},[n("span",null,[o(v,null,{default:d((()=>[o(m)])),_:1})])])):r("",!0)])),_:1})])}}}),[["__scopeId","data-v-82fdfcde"]]);export{B as default};
