(()=>{var e={};e.id=974,e.ids=[974],e.modules={99:(e,r,t)=>{"use strict";t.d(r,{Button:()=>l,r:()=>d});var n=t(5781),s=t(3072),a=t(4888),o=t(7990),i=t(7401);let d=(0,o.F)("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",{variants:{variant:{default:"bg-launchpad-blue text-white hover:bg-launchpad-teal",primary:"bg-launchpad-blue text-white hover:bg-launchpad-teal shadow-sm",secondary:"bg-launchpad-lightBlue text-launchpad-blue hover:bg-launchpad-blue hover:text-white",success:"bg-launchpad-green text-white hover:bg-launchpad-darkGreen",warning:"bg-launchpad-orange text-white hover:bg-launchpad-brown",danger:"bg-red-500 text-white hover:bg-red-600",outline:"border border-gray-200 bg-white hover:bg-gray-50 hover:text-launchpad-blue",ghost:"hover:bg-gray-100 hover:text-launchpad-blue",link:"text-launchpad-blue underline-offset-4 hover:underline"},size:{default:"h-10 px-4 py-2",sm:"h-8 rounded-md px-3 text-xs",lg:"h-12 rounded-md px-6 text-base",icon:"h-9 w-9",auto:"h-auto px-3 py-1.5"}},defaultVariants:{variant:"default",size:"default"}}),l=s.forwardRef(({className:e,variant:r,size:t,asChild:s=!1,children:o,icon:l,isLoading:c,...p},h)=>{let u=s?a.DX:"button";return(0,n.jsxs)(u,{className:(0,i.cn)(d({variant:r,size:t,className:e})),ref:h,disabled:c||p.disabled,...p,children:[c&&(0,n.jsxs)("svg",{className:"animate-spin -ml-1 mr-2 h-4 w-4 text-current",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[(0,n.jsx)("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),(0,n.jsx)("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),l&&!c&&(0,n.jsx)("span",{className:"mr-1",children:l}),o]})});l.displayName="Button"},846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},1549:(e,r,t)=>{Promise.resolve().then(t.bind(t,2801)),Promise.resolve().then(t.bind(t,4519)),Promise.resolve().then(t.t.bind(t,7846,23))},1621:(e,r,t)=>{"use strict";t.r(r),t.d(r,{GlobalError:()=>o.a,__next_app__:()=>p,pages:()=>c,routeModule:()=>h,tree:()=>l});var n=t(7025),s=t(8198),a=t(2576),o=t.n(a),i=t(5239),d={};for(let e in i)0>["default","tree","pages","GlobalError","__next_app__","routeModule"].indexOf(e)&&(d[e]=()=>i[e]);t.d(r,d);let l=["",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(t.bind(t,9225)),"/Users/archer/projects/node/Launchpad-Career-Hub/app/page.tsx"]}]},{layout:[()=>Promise.resolve().then(t.bind(t,9650)),"/Users/archer/projects/node/Launchpad-Career-Hub/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(t.t.bind(t,4540,23)),"next/dist/client/components/not-found-error"],forbidden:[()=>Promise.resolve().then(t.t.bind(t,3117,23)),"next/dist/client/components/forbidden-error"],unauthorized:[()=>Promise.resolve().then(t.t.bind(t,6874,23)),"next/dist/client/components/unauthorized-error"]}],c=["/Users/archer/projects/node/Launchpad-Career-Hub/app/page.tsx"],p={require:t,loadChunk:()=>Promise.resolve()},h=new n.AppPageRouteModule({definition:{kind:s.RouteKind.APP_PAGE,page:"/page",pathname:"/",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:l}})},2061:(e,r,t)=>{"use strict";t.d(r,{Card:()=>l,CardContent:()=>u,CardDescription:()=>h,CardFooter:()=>m,CardHeader:()=>c,CardTitle:()=>p});var n=t(5781),s=t(3072),a=t(7401),o=t(7990),i=t(9118);let d=(0,o.F)("rounded-lg border bg-white text-card-foreground shadow-sm transition-all",{variants:{variant:{default:"border-gray-200",primary:"border-l-4 border-l-launchpad-blue border-t border-r border-b border-gray-200",success:"border-l-4 border-l-launchpad-green border-t border-r border-b border-gray-200",warning:"border-l-4 border-l-launchpad-orange border-t border-r border-b border-gray-200",danger:"border-l-4 border-red-500 border-t border-r border-b border-gray-200",ghost:"border-transparent shadow-none bg-transparent"},size:{default:"",sm:"p-3",lg:"p-6"},hover:{true:"hover:shadow-md hover:border-launchpad-blue/30",false:""}},defaultVariants:{variant:"default",hover:!0}}),l=s.forwardRef(({className:e,variant:r,size:t,hover:s,animated:o=!1,...l},c)=>{let p=(0,a.cn)(d({variant:r,size:t,hover:s,className:e}));return o?(0,n.jsx)(i.P.div,{ref:c,className:p,whileHover:{y:-5,scale:1.02},transition:{type:"spring",stiffness:300,damping:30},...l}):(0,n.jsx)("div",{ref:c,className:p,...l})});l.displayName="Card";let c=s.forwardRef(({className:e,...r},t)=>(0,n.jsx)("div",{ref:t,className:(0,a.cn)("flex flex-col space-y-1.5 p-6",e),...r}));c.displayName="CardHeader";let p=s.forwardRef(({className:e,...r},t)=>(0,n.jsx)("h3",{ref:t,className:(0,a.cn)("text-lg font-semibold leading-none tracking-tight text-gray-900",e),...r}));p.displayName="CardTitle";let h=s.forwardRef(({className:e,...r},t)=>(0,n.jsx)("p",{ref:t,className:(0,a.cn)("text-sm text-gray-500",e),...r}));h.displayName="CardDescription";let u=s.forwardRef(({className:e,...r},t)=>(0,n.jsx)("div",{ref:t,className:(0,a.cn)("p-6 pt-0",e),...r}));u.displayName="CardContent";let m=s.forwardRef(({className:e,...r},t)=>(0,n.jsx)("div",{ref:t,className:(0,a.cn)("flex items-center p-6 pt-0",e),...r}));m.displayName="CardFooter"},2801:(e,r,t)=>{"use strict";t.d(r,{Button:()=>s});var n=t(1129);let s=(0,n.registerClientReference)(function(){throw Error("Attempted to call Button() from the server but Button is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/archer/projects/node/Launchpad-Career-Hub/components/ui/basic/button.tsx","Button");(0,n.registerClientReference)(function(){throw Error("Attempted to call buttonVariants() from the server but buttonVariants is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/archer/projects/node/Launchpad-Career-Hub/components/ui/basic/button.tsx","buttonVariants")},3033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},3873:e=>{"use strict";e.exports=require("path")},4519:(e,r,t)=>{"use strict";t.d(r,{Card:()=>s,CardContent:()=>l,CardDescription:()=>d,CardFooter:()=>o,CardHeader:()=>a,CardTitle:()=>i});var n=t(1129);let s=(0,n.registerClientReference)(function(){throw Error("Attempted to call Card() from the server but Card is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/archer/projects/node/Launchpad-Career-Hub/components/ui/basic/card.tsx","Card"),a=(0,n.registerClientReference)(function(){throw Error("Attempted to call CardHeader() from the server but CardHeader is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/archer/projects/node/Launchpad-Career-Hub/components/ui/basic/card.tsx","CardHeader"),o=(0,n.registerClientReference)(function(){throw Error("Attempted to call CardFooter() from the server but CardFooter is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/archer/projects/node/Launchpad-Career-Hub/components/ui/basic/card.tsx","CardFooter"),i=(0,n.registerClientReference)(function(){throw Error("Attempted to call CardTitle() from the server but CardTitle is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/archer/projects/node/Launchpad-Career-Hub/components/ui/basic/card.tsx","CardTitle"),d=(0,n.registerClientReference)(function(){throw Error("Attempted to call CardDescription() from the server but CardDescription is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/archer/projects/node/Launchpad-Career-Hub/components/ui/basic/card.tsx","CardDescription"),l=(0,n.registerClientReference)(function(){throw Error("Attempted to call CardContent() from the server but CardContent is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/archer/projects/node/Launchpad-Career-Hub/components/ui/basic/card.tsx","CardContent")},7401:(e,r,t)=>{"use strict";t.d(r,{cn:()=>a});var n=t(2366),s=t(3927);function a(...e){return(0,s.QP)((0,n.$)(e))}},7846:(e,r,t)=>{let{createProxy:n}=t(1614);e.exports=n("/Users/archer/projects/node/Launchpad-Career-Hub/node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/client/app-dir/link.js")},8045:(e,r,t)=>{Promise.resolve().then(t.bind(t,99)),Promise.resolve().then(t.bind(t,2061)),Promise.resolve().then(t.t.bind(t,8328,23))},9121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},9225:(e,r,t)=>{"use strict";t.r(r),t.d(r,{default:()=>d});var n=t(5479),s=t(7846),a=t.n(s),o=t(2801),i=t(4519);function d(){return(0,n.jsxs)("div",{className:"min-h-screen flex flex-col",children:[(0,n.jsx)("header",{className:"border-b",children:(0,n.jsxs)("div",{className:"container mx-auto py-4 px-4 flex justify-between items-center",children:[(0,n.jsx)("h1",{className:"text-2xl font-bold",children:"Job Finder Portal"}),(0,n.jsxs)("div",{className:"flex gap-4",children:[(0,n.jsx)(a(),{href:"/login",children:(0,n.jsx)(o.Button,{variant:"outline",children:"Login"})}),(0,n.jsx)(a(),{href:"/register",children:(0,n.jsx)(o.Button,{children:"Register"})})]})]})}),(0,n.jsx)("main",{className:"flex-1 container mx-auto py-8 px-4",children:(0,n.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-8 items-center",children:[(0,n.jsxs)("div",{children:[(0,n.jsx)("h2",{className:"text-4xl font-bold mb-4",children:"Find Your Dream Job"}),(0,n.jsx)("p",{className:"text-lg text-muted-foreground mb-6",children:"Connect with top employers and track your applications in one place."}),(0,n.jsxs)("div",{className:"flex gap-4",children:[(0,n.jsx)(a(),{href:"/admin/dashboard",children:(0,n.jsx)(o.Button,{size:"lg",children:"Admin Dashboard"})}),(0,n.jsx)(a(),{href:"/applicant/dashboard",children:(0,n.jsx)(o.Button,{size:"lg",variant:"outline",children:"Applicant Dashboard"})})]})]}),(0,n.jsxs)("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:[(0,n.jsxs)(i.Card,{children:[(0,n.jsxs)(i.CardHeader,{children:[(0,n.jsx)(i.CardTitle,{children:"For Applicants"}),(0,n.jsx)(i.CardDescription,{children:"Manage your job search"})]}),(0,n.jsx)(i.CardContent,{children:(0,n.jsxs)("ul",{className:"list-disc pl-5 space-y-2",children:[(0,n.jsx)("li",{children:"Track applications"}),(0,n.jsx)("li",{children:"Save interesting jobs"}),(0,n.jsx)("li",{children:"View upcoming events"}),(0,n.jsx)("li",{children:"Get personalized recommendations"})]})}),(0,n.jsx)(i.CardFooter,{children:(0,n.jsx)(a(),{href:"/applicant/dashboard",className:"w-full",children:(0,n.jsx)(o.Button,{className:"w-full",children:"Applicant Portal"})})})]}),(0,n.jsxs)(i.Card,{children:[(0,n.jsxs)(i.CardHeader,{children:[(0,n.jsx)(i.CardTitle,{children:"For Admins"}),(0,n.jsx)(i.CardDescription,{children:"Manage the hiring process"})]}),(0,n.jsx)(i.CardContent,{children:(0,n.jsxs)("ul",{className:"list-disc pl-5 space-y-2",children:[(0,n.jsx)("li",{children:"Track applicants"}),(0,n.jsx)("li",{children:"View analytics"}),(0,n.jsx)("li",{children:"Manage job listings"}),(0,n.jsx)("li",{children:"Schedule events"})]})}),(0,n.jsx)(i.CardFooter,{children:(0,n.jsx)(a(),{href:"/admin/dashboard",className:"w-full",children:(0,n.jsx)(o.Button,{className:"w-full",children:"Admin Portal"})})})]})]})]})}),(0,n.jsx)("footer",{className:"border-t py-6",children:(0,n.jsx)("div",{className:"container mx-auto px-4 text-center text-muted-foreground",children:(0,n.jsx)("p",{children:"\xa9 2025 Job Finder Portal. All rights reserved."})})})]})}},9294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")}};var r=require("../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),n=r.X(0,[752,915,978],()=>t(1621));module.exports=n})();