import{B as p,c as _,w as s,ad as c,o as b,a as e,f as g,s as w,C as V,D as n,u as r,E as $,G as h,H as m,t as y,K as k,a1 as B}from"./index.0cc9c209.js";import{_ as U}from"./SectionFullScreen.95a06830.js";import{_ as t,a as x}from"./FormField.9802eb60.js";const A={__name:"LoginView",setup(C){const a=p({login:"john.doe",pass:"highly-secure-password-fYjUw-",remember:["remember"]}),i=y(),u=()=>{i.push("/dashboard")};return(L,o)=>(b(),_(c,null,{default:s(()=>[e(U,{bg:"login"},{default:s(({cardClass:d,cardRounded:f})=>[e(g,{class:w(d),rounded:f,form:"",onSubmit:V(u,["prevent"])},{default:s(()=>[e(t,{label:"Login",help:"Please enter your login"},{default:s(()=>[e(n,{modelValue:a.login,"onUpdate:modelValue":o[0]||(o[0]=l=>a.login=l),icon:r(k),name:"login",autocomplete:"username"},null,8,["modelValue","icon"])]),_:1}),e(t,{label:"Password",help:"Please enter your password"},{default:s(()=>[e(n,{modelValue:a.pass,"onUpdate:modelValue":o[1]||(o[1]=l=>a.pass=l),icon:r(B),type:"password",name:"password",autocomplete:"current-password"},null,8,["modelValue","icon"])]),_:1}),e(x,{modelValue:a.remember,"onUpdate:modelValue":o[2]||(o[2]=l=>a.remember=l),name:"remember",options:{remember:"Remember"}},null,8,["modelValue"]),e($),e(h,null,{default:s(()=>[e(m,{type:"submit",color:"info",label:"Login"}),e(m,{to:"/dashboard",color:"info",outline:"",label:"Back"})]),_:1})]),_:2},1032,["class","rounded","onSubmit"])]),_:1})]),_:1}))}};export{A as default};