import{d as e,u as a,r as l,c as s,a as o,b as r,e as u,w as t,T as d,n,f as i,g as m,v as p,h as c,o as v,t as f,i as g,j as w,E as b,k as h,l as _,_ as V}from"./index.js";import{E as y}from"./api.js";const C={class:"login-wrapper"},k={class:"login-container"},q={class:"form sign-in"},E={id:"captchaQuestion",style:{color:"black"}},U={class:"buttonWrapper"},T={class:"forgot-pass"},I={class:"img"},x={class:"imgText m-up"},P={class:"imgText m-in"},R={class:"imgBtn"},j={class:"form sign-up"},M={class:"buttonWrapper"},S=V(e({__name:"Login",setup(e){const V=a(),S=_();l(!1);const N=l({username:"",password:"",captcha:""}),O=l({username:[{required:!0,message:"请输入用户名",trigger:"blur"}],password:[{required:!0,message:"请输入密码",trigger:"blur"}],captcha:[{required:!0,message:"请输入验证码",trigger:"blur"}]}),D=l(null),F=l({username:"",password:"",confirmPassword:"",email:"",emailCode:""}),G=l(!1),L=()=>(G.value=!G.value,{isSignup:G,toggleSignup:L}),W=s((()=>({}))),$=()=>{const e=Math.floor(10*Math.random())+10,a=Math.floor(10*Math.random())+10;return{question:`${e} + ${a}`,answer:e+a}},A=l($()),B=l(A.value.question),Q=()=>{D.value.validate((e=>e?parseInt(N.value.captcha)!==A.value.answer?(b.error("验证码错误"),A.value=$(),void(B.value=A.value.question)):void h.post(y.LOGIN,{username:N.value.username,password:N.value.password},{headers:{"Content-Type":"application/json"}}).then((e=>{if(830===e.data.status){const{username:a,is_admin:l,token:s}=e.data;V.login(a,l,s),b.success("登录成功"),S.push("/")}else b.error("登录失败，账号或密码错误"),console.log(e.data)})).catch((e=>{b.error("登录失败"),console.error("登录出错",e.message)})):(b.error("请正确填写信息"),!1)))},z=l(null),H={username:[{required:!0,message:"请输入用户名",trigger:"blur"}],password:[{required:!0,message:"请输入密码",trigger:"blur"},{min:6,message:"密码长度不能小于6位",trigger:"blur"}],confirmPassword:[{required:!0,message:"请确认密码",trigger:"blur"},{validator:(e,a,l)=>{a!==F.value.password?l(new Error("两次输入的密码不一致")):l()},trigger:"blur"}],email:[{required:!0,message:"请输入邮箱",trigger:"blur"},{type:"email",message:"请输入正确的邮箱地址",trigger:"blur"}],emailCode:[{required:!0,message:"请输入邮箱验证码",trigger:"blur"}]},J=l(!1),K=l(null),X=()=>{J.value?b.warning("请稍后再试"):(J.value=!0,h.post(y.SENDVERICATIONCODE,{email:F.value.email}).then((e=>{830===e.data.status?(b.success("验证码已发送"),Y()):(b.error("发送验证码失败"),J.value=!1)})).catch((e=>{b.error("发送验证码失败"),console.error("发送验证码出错",e.message),J.value=!1})))},Y=()=>{K.value=setTimeout((()=>{J.value=!1}),6e4)},Z=()=>{z.value.validate((e=>{if(!e)return b.error("请正确填写信息"),!1;h.post(y.REGISTER,{username:F.value.username,password:F.value.password,email:F.value.email,code:F.value.emailCode},{withCredentials:!0}).then((e=>{830===e.data.status?(b.success("注册成功，自动跳转登录界面"),S.push("/login")):(b.error("注册失败"),console.log(e.data))})).catch((e=>{b.error("注册失败，存在异常")}))}))},ee=()=>{b.warning("暂不支持微信登录")},ae=()=>{b.warning("暂不支持微信注册")};return(e,a)=>{const l=c("el-input"),s=c("el-form-item"),b=c("el-form"),h=c("el-button"),_=c("router-link"),V=c("el-icon");return v(),o("div",C,[r("div",k,[u(d,{name:"slide-login",mode:"out-in"},{default:t((()=>[m(r("div",q,[a[12]||(a[12]=r("h2",{style:{color:"black"}},"欢迎回来",-1)),u(b,{model:N.value,rules:O.value,ref_key:"loginFormRef",ref:D,class:"form-content"},{default:t((()=>[u(s,{prop:"username",label:"用户名"},{default:t((()=>[u(l,{modelValue:N.value.username,"onUpdate:modelValue":a[0]||(a[0]=e=>N.value.username=e),autocomplete:"off"},null,8,["modelValue"])])),_:1}),u(s,{prop:"password",label:"密码"},{default:t((()=>[u(l,{modelValue:N.value.password,"onUpdate:modelValue":a[1]||(a[1]=e=>N.value.password=e),type:"password",autocomplete:"off","show-password":""},null,8,["modelValue"])])),_:1}),u(s,{label:"验证码",prop:"captcha"},{default:t((()=>[r("div",E,"请计算："+f(B.value),1),u(l,{modelValue:N.value.captcha,"onUpdate:modelValue":a[2]||(a[2]=e=>N.value.captcha=e),autocomplete:"off"},null,8,["modelValue"])])),_:1})])),_:1},8,["model","rules"]),r("div",U,[u(h,{type:"primary",class:"submit",onClick:Q},{default:t((()=>a[8]||(a[8]=[g("登 录")]))),_:1}),u(h,{type:"success",class:"wechat-btn",onClick:ee},{default:t((()=>a[9]||(a[9]=[g("使用 "),r("span",null,"微信",-1),g(" 帐号登录")]))),_:1})]),r("p",T,[u(_,{to:"/",style:{"margin-right":"14px"}},{default:t((()=>a[10]||(a[10]=[g("返回主页")]))),_:1}),u(_,{to:"/forgotpassword"},{default:t((()=>a[11]||(a[11]=[g(" 忘记密码？")]))),_:1})])],512),[[p,!G.value]])])),_:1}),r("div",{style:i(W.value),class:n(["sub-content",{hidden:G.value}])},[r("div",I,[m(r("div",x,a[13]||(a[13]=[r("h3",null,"还未注册？",-1),r("p",null,"立即注册！",-1)]),512),[[p,!G.value]]),m(r("div",P,a[14]||(a[14]=[r("h3",null,"已有帐号？",-1),r("p",null,"有帐号就登录吧, ",-1),r("p",null," 好久不见了！",-1)]),512),[[p,G.value]]),r("div",R,[u(h,{type:"primary",onClick:L,style:{"background-color":"#f08c4e"},id:"img_btn"},{default:t((()=>[G.value?(v(),w(V,{key:1},{default:t((()=>a[16]||(a[16]=[g(" 登录 ")]))),_:1})):(v(),w(V,{key:0},{default:t((()=>a[15]||(a[15]=[g("注册 ")]))),_:1}))])),_:1})])])],6),u(d,{name:"slide-register",mode:"out-in"},{default:t((()=>[m(r("div",j,[a[20]||(a[20]=r("h2",null,"立即注册",-1)),u(b,{model:F.value,rules:H,ref_key:"registerFormRef",ref:z,class:"form-content"},{default:t((()=>[u(s,{prop:"username",label:"用户名"},{default:t((()=>[u(l,{modelValue:F.value.username,"onUpdate:modelValue":a[3]||(a[3]=e=>F.value.username=e),autocomplete:"off"},null,8,["modelValue"])])),_:1}),u(s,{prop:"email",label:"邮箱"},{default:t((()=>[u(l,{modelValue:F.value.email,"onUpdate:modelValue":a[4]||(a[4]=e=>F.value.email=e),autocomplete:"off"},null,8,["modelValue"])])),_:1}),u(s,{prop:"password",label:"密码"},{default:t((()=>[u(l,{modelValue:F.value.password,"onUpdate:modelValue":a[5]||(a[5]=e=>F.value.password=e),type:"password",autocomplete:"off","show-password":""},null,8,["modelValue"])])),_:1}),u(s,{label:"确认密码",prop:"confirmPassword"},{default:t((()=>[u(l,{type:"password",modelValue:F.value.confirmPassword,"onUpdate:modelValue":a[6]||(a[6]=e=>F.value.confirmPassword=e),autocomplete:"off","show-password":""},null,8,["modelValue"])])),_:1}),u(s,{label:"邮箱验证码",prop:"emailCode"},{default:t((()=>[u(l,{modelValue:F.value.emailCode,"onUpdate:modelValue":a[7]||(a[7]=e=>F.value.emailCode=e),autocomplete:"off"},null,8,["modelValue"]),u(h,{onClick:X,disabled:J.value,id:"emailCode"},{default:t((()=>a[17]||(a[17]=[g("发送验证码")]))),_:1},8,["disabled"])])),_:1})])),_:1},8,["model"]),r("div",M,[u(h,{type:"primary",class:"submit",onClick:Z},{default:t((()=>a[18]||(a[18]=[g("注 册")]))),_:1}),u(h,{type:"success",class:"wechat-btn",onClick:ae},{default:t((()=>a[19]||(a[19]=[g("使用 "),r("span",null,"微信",-1),g(" 帐号注册")]))),_:1})])],512),[[p,G.value]])])),_:1})])])}}}),[["__scopeId","data-v-558a29e3"]]);export{S as default};
