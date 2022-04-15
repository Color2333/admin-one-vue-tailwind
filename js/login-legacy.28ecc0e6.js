"use strict";(self["webpackChunkadmin_one_vue_tailwind"]=self["webpackChunkadmin_one_vue_tailwind"]||[]).push([[535],{2618:function(e,n,t){t.d(n,{Z:function(){return m}});t(9653),t(8309);var r=t(6252),l=t(3577),u=t(2262),o=t(9963),a=["type","name","value"],i=(0,r._)("span",{class:"check"},null,-1),s={class:"control-label"},c={props:{options:{type:Object,default:function(){}},name:{type:String,required:!0},type:{type:String,default:"checkbox"},column:Boolean,modelValue:{type:[Object,Array,String,Number],default:null}},emits:["update:modelValue"],setup:function(e,n){var t=n.emit,c=e,d=(0,r.Fl)({get:function(){return c.modelValue},set:function(e){t("update:modelValue",e)}}),m=(0,r.Fl)((function(){return"radio"===c.type?"radio":"checkbox"}));return function(n,t){return(0,r.wg)(),(0,r.iD)("div",{class:(0,l.C_)(["flex justify-start flex-wrap -mb-3",{"flex-col":e.column}])},[((0,r.wg)(!0),(0,r.iD)(r.HY,null,(0,r.Ko)(e.options,(function(n,c){return(0,r.wg)(),(0,r.iD)("label",{key:c,class:(0,l.C_)([e.type,"mr-6 mb-3 last:mr-0"])},[(0,r.wy)((0,r._)("input",{"onUpdate:modelValue":t[0]||(t[0]=function(e){return(0,u.dq)(d)?d.value=e:null}),type:(0,u.SU)(m),name:e.name,value:c},null,8,a),[[o.YZ,(0,u.SU)(d)]]),i,(0,r._)("span",s,(0,l.zw)(n),1)],2)})),128))],2)}}};const d=c;var m=d},5690:function(e,n,t){t.d(n,{Z:function(){return d}});var r=t(6252),l=t(3577),u=t(2262),o={class:"mb-6 last:mb-0"},a={key:0,class:"block font-bold mb-2"},i={key:1,class:"text-xs text-gray-500 dark:text-gray-400 mt-1"},s={props:{label:{type:String,default:null},help:{type:String,default:null}},setup:function(e){var n=(0,r.Rr)(),t=(0,r.Fl)((function(){var e=[],t=n.default().length;return t>1&&e.push("grid grid-cols-1 gap-3"),2===t&&e.push("md:grid-cols-2"),e}));return function(n,s){return(0,r.wg)(),(0,r.iD)("div",o,[e.label?((0,r.wg)(),(0,r.iD)("label",a,(0,l.zw)(e.label),1)):(0,r.kq)("",!0),(0,r._)("div",{class:(0,l.C_)((0,u.SU)(t))},[(0,r.WI)(n.$slots,"default")],2),e.help?((0,r.wg)(),(0,r.iD)("div",i,(0,l.zw)(e.help),1)):(0,r.kq)("",!0)])}}};const c=s;var d=c},9995:function(e,n,t){t.d(n,{Z:function(){return d}});t(6699);var r=t(6252),l=t(3577),u=t(2262),o=t(3907),a=t(1088),i=t(7315),s={props:{bg:{type:String,required:!0,validator:function(e){return["login","error"].includes(e)}}},setup:function(e){var n=e,t=(0,o.oR)(),s=(0,r.Fl)((function(){return t.state.darkMode})),c=(0,r.Fl)((function(){switch(n.bg){case"login":return s.value?a.K3:a.jH;case"error":return s.value?a.bW:a.Zi}return""}));return function(e,n){return(0,r.wg)(),(0,r.j4)(i.Z,{class:(0,l.C_)(["flex h-screen items-center justify-center",(0,u.SU)(c)])},{default:(0,r.w5)((function(){return[(0,r.WI)(e.$slots,"default",{cardClass:"w-11/12 md:w-7/12 lg:w-6/12 xl:w-4/12 shadow-2xl",cardRounded:"rounded-lg"})]})),_:3},8,["class"])}}};const c=s;var d=c},6615:function(e,n,t){t.r(n),t.d(n,{default:function(){return y}});var r=t(6252),l=t(3577),u=t(9963),o=t(2262),a=t(2119),i=t(5317),s=t(9995),c=t(9890),d=t(2618),m=t(5690),f=t(2213),p=t(5693),b=t(1388),g=t(6373),w={setup:function(e){var n=(0,o.qj)({login:"john.doe",pass:"highly-secure-password-fYjUw-",remember:["remember"]}),t=(0,a.tv)(),w=function(){t.push("/dashboard")};return function(e,t){return(0,r.wg)(),(0,r.j4)(s.Z,{bg:"login"},{default:(0,r.w5)((function(e){var a=e.cardClass,s=e.cardRounded;return[(0,r.Wm)(c.Z,{class:(0,l.C_)(a),rounded:s,form:"",onSubmit:(0,u.iM)(w,["prevent"])},{default:(0,r.w5)((function(){return[(0,r.Wm)(m.Z,{label:"Login",help:"Please enter your login"},{default:(0,r.w5)((function(){return[(0,r.Wm)(f.Z,{modelValue:(0,o.SU)(n).login,"onUpdate:modelValue":t[0]||(t[0]=function(e){return(0,o.SU)(n).login=e}),icon:(0,o.SU)(i.rI3),name:"login",autocomplete:"username"},null,8,["modelValue","icon"])]})),_:1}),(0,r.Wm)(m.Z,{label:"Password",help:"Please enter your password"},{default:(0,r.w5)((function(){return[(0,r.Wm)(f.Z,{modelValue:(0,o.SU)(n).pass,"onUpdate:modelValue":t[1]||(t[1]=function(e){return(0,o.SU)(n).pass=e}),icon:(0,o.SU)(i.AD$),type:"password",name:"password",autocomplete:"current-password"},null,8,["modelValue","icon"])]})),_:1}),(0,r.Wm)(d.Z,{modelValue:(0,o.SU)(n).remember,"onUpdate:modelValue":t[2]||(t[2]=function(e){return(0,o.SU)(n).remember=e}),name:"remember",options:{remember:"Remember"}},null,8,["modelValue"]),(0,r.Wm)(p.Z),(0,r.Wm)(g.Z,null,{default:(0,r.w5)((function(){return[(0,r.Wm)(b.Z,{type:"submit",color:"info",label:"Login"}),(0,r.Wm)(b.Z,{to:"/dashboard",color:"info",outline:"",label:"Back"})]})),_:1})]})),_:2},1032,["class","rounded","onSubmit"])]})),_:1})}}};const v=w;var y=v}}]);
//# sourceMappingURL=login-legacy.28ecc0e6.js.map