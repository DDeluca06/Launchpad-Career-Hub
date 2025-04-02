(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[312],{2027:(e,a,s)=>{"use strict";s.r(a),s.d(a,{default:()=>k});var t=s(1215),l=s(6725),r=s(9037),i=s(8471),o=s(6863),n=s(3416),c=s(8022),d=s(3344),m=s(2772),p=s(8475);let h=(0,p.A)("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]),x=(0,p.A)("Building",[["rect",{width:"16",height:"20",x:"4",y:"2",rx:"2",ry:"2",key:"76otgf"}],["path",{d:"M9 22v-4h6v4",key:"r93iot"}],["path",{d:"M8 6h.01",key:"1dz90k"}],["path",{d:"M16 6h.01",key:"1x0f13"}],["path",{d:"M12 6h.01",key:"1vi96p"}],["path",{d:"M12 10h.01",key:"1nrarc"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M16 10h.01",key:"1m94wz"}],["path",{d:"M16 14h.01",key:"1gbofw"}],["path",{d:"M8 10h.01",key:"19clt8"}],["path",{d:"M8 14h.01",key:"6423bh"}]]);var g=s(2958);let y=(0,p.A)("CircleCheckBig",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);var u=s(5591),f=s(9473),b=s(6789),v=s(6446),j=s(1226),w=s(411);let N=[{id:"1",title:"Frontend Developer",company:"Tech Co",location:"Remote",type:"Full-time",description:"We are looking for a skilled Frontend Developer to join our team. You will be responsible for building user interfaces and implementing designs.",requirements:["3+ years of experience with React","Strong knowledge of HTML, CSS, and JavaScript","Experience with responsive design","Familiarity with modern frontend tools"],postedDate:"2 days ago",salary:"$80k - $120k"},{id:"2",title:"Backend Engineer",company:"Software Inc",location:"New York",type:"Full-time",description:"Join our engineering team to build scalable backend systems for our growing platform.",requirements:["Experience with Node.js or Python","Knowledge of database systems","Experience with API design","Understanding of cloud infrastructure"],postedDate:"1 week ago",salary:"$90k - $130k"},{id:"3",title:"Full Stack Developer",company:"Web Solutions",location:"San Francisco",type:"Contract",description:"Looking for a versatile developer who can work on both frontend and backend technologies.",requirements:["Experience with modern JavaScript frameworks","Knowledge of backend technologies","Database experience","Good communication skills"],postedDate:"3 days ago",salary:"$100k - $140k"},{id:"4",title:"UI/UX Designer",company:"Design Studio",location:"Remote",type:"Part-time",description:"Join our creative team to design beautiful and functional user interfaces.",requirements:["Portfolio of design work","Experience with Figma or similar tools","Understanding of user-centered design","Ability to collaborate with developers"],postedDate:"5 days ago",salary:"$70k - $90k"},{id:"5",title:"DevOps Engineer",company:"Cloud Systems",location:"Seattle",type:"Full-time",description:"Help us build and maintain our cloud infrastructure and deployment pipelines.",requirements:["Experience with AWS or Azure","Knowledge of CI/CD practices","Containerization experience","Infrastructure as code"],postedDate:"2 weeks ago",salary:"$95k - $135k"},{id:"6",title:"Product Manager",company:"Product Co",location:"Boston",type:"Full-time",description:"Lead product strategy and development for our growing suite of applications.",requirements:["3+ years in product management","Experience with agile methodologies","Strong analytical skills","Excellent communication"],postedDate:"1 month ago",salary:"$110k - $150k"}];function k(){let[e,a]=(0,u.useState)(""),[s,p]=(0,u.useState)(!1),[k,C]=(0,u.useState)(N[0]),[A,E]=(0,u.useState)({jobTypes:[],locations:[],remoteOnly:!1,salary:[0,200],experienceLevel:"any",keywords:""}),S=e=>{E(e),p(!1),console.log("Applied filters:",e)},D=e=>{C(e)},F=N.filter(a=>{var s,t,l,r,i,o;if(e){let r=e.toLowerCase();if(!(a.title.toLowerCase().includes(r)||a.company.toLowerCase().includes(r)||(null===(s=a.location)||void 0===s?void 0:s.toLowerCase().includes(r))||(null===(t=a.type)||void 0===t?void 0:t.toLowerCase().includes(r))||(null===(l=a.description)||void 0===l?void 0:l.toLowerCase().includes(r))))return!1}if(A.jobTypes.length>0){let e=null===(r=a.type)||void 0===r?void 0:r.toLowerCase().replace("-","_");if(!e||!A.jobTypes.some(a=>e.includes(a)))return!1}if(A.locations.length>0){let e=null===(i=a.location)||void 0===i?void 0:i.toLowerCase();if(A.remoteOnly&&!(null==e?void 0:e.includes("remote"))||!A.remoteOnly&&!A.locations.some(a=>null==e?void 0:e.includes(a.replace("_"," "))))return!1}else if(A.remoteOnly){let e=null===(o=a.location)||void 0===o?void 0:o.toLowerCase();if(!(null==e?void 0:e.includes("remote")))return!1}return!0}),L=()=>{let e=0;return A.jobTypes.length>0&&(e+=A.jobTypes.length),A.locations.length>0&&(e+=A.locations.length),A.remoteOnly&&(e+=1),"any"!==A.experienceLevel&&(e+=1),(A.salary[0]>0||A.salary[1]<200)&&(e+=1),A.keywords.trim()&&(e+=1),e};return(0,t.jsxs)(l.N,{children:[(0,t.jsxs)("div",{className:"container p-4 mx-auto max-w-screen-xl",children:[(0,t.jsx)("div",{className:"flex flex-col md:flex-row items-center justify-between mb-6",children:(0,t.jsx)("h1",{className:"text-2xl font-bold text-gray-900",children:"Browse Jobs"})}),(0,t.jsx)("div",{className:"bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6",children:(0,t.jsxs)("div",{className:"flex gap-3",children:[(0,t.jsxs)("div",{className:"relative flex-grow",children:[(0,t.jsx)(n.A,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"}),(0,t.jsx)(o.p,{type:"search",placeholder:"Search job title, company, or keywords...",className:"pl-10 border-gray-200 focus:border-launchpad-blue",value:e,onChange:e=>a(e.target.value)})]}),(0,t.jsxs)(r.Button,{onClick:()=>{p(!0)},className:"bg-launchpad-blue hover:bg-launchpad-teal text-white gap-2 whitespace-nowrap relative",children:[(0,t.jsx)(c.A,{className:"h-4 w-4"}),"Filters",L()>0&&(0,t.jsx)(v.Ex,{className:"ml-1 bg-white text-launchpad-blue font-bold text-xs h-5 absolute -top-2 -right-2",children:L()})]})]})}),(0,t.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-8 gap-6",children:[(0,t.jsxs)("div",{className:"lg:col-span-3 space-y-4",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between mb-2",children:[(0,t.jsx)("h2",{className:"text-lg font-medium text-gray-900",children:"Available Positions"}),(0,t.jsxs)("span",{className:"text-sm text-gray-500",children:[F.length," jobs found"]})]}),(0,t.jsx)("div",{className:"space-y-3",children:F.map(e=>(0,t.jsx)("div",{onClick:()=>D(e),className:(0,w.cn)("bg-white rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md",k.id===e.id?"border-launchpad-blue border-l-4":"border-gray-100"),children:(0,t.jsxs)("div",{className:"flex items-start gap-3",children:[(0,t.jsx)("div",{className:"w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-200",children:e.company.charAt(0)}),(0,t.jsxs)("div",{className:"flex-1",children:[(0,t.jsx)("h3",{className:"font-medium text-gray-900",children:e.title}),(0,t.jsx)("p",{className:"text-sm text-gray-500 mt-1",children:e.company}),(0,t.jsxs)("div",{className:"flex flex-wrap gap-2 mt-2",children:[(0,t.jsxs)(v.Ex,{variant:"outline",className:"flex items-center text-xs gap-1 font-normal border-gray-200",children:[(0,t.jsx)(d.A,{className:"h-3 w-3"}),e.location]}),(0,t.jsxs)(v.Ex,{variant:"outline",className:"flex items-center text-xs gap-1 font-normal border-gray-200",children:[(0,t.jsx)(m.A,{className:"h-3 w-3"}),e.type]}),(0,t.jsxs)(v.Ex,{variant:"outline",className:"flex items-center text-xs gap-1 font-normal border-gray-200",children:[(0,t.jsx)(h,{className:"h-3 w-3"}),e.postedDate]})]})]})]})},e.id))})]}),(0,t.jsx)("div",{className:"lg:col-span-5",children:(0,t.jsx)(i.Card,{className:"border-gray-100 shadow-sm",children:(0,t.jsxs)(i.CardContent,{className:"p-6",children:[(0,t.jsxs)("div",{className:"mb-4",children:[(0,t.jsxs)("div",{className:"flex justify-between items-start",children:[(0,t.jsxs)("div",{className:"space-y-1",children:[(0,t.jsx)("h2",{className:"text-2xl font-bold text-gray-900",children:k.title}),(0,t.jsxs)("div",{className:"flex items-center space-x-2 text-gray-600",children:[(0,t.jsx)(x,{className:"h-4 w-4"}),(0,t.jsx)("span",{children:k.company})]})]}),(0,t.jsx)(r.Button,{className:"bg-launchpad-blue hover:bg-launchpad-teal",children:"Apply Now"})]}),(0,t.jsxs)("div",{className:"flex flex-wrap gap-3 mt-4",children:[(0,t.jsxs)(v.Ex,{className:"bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-1 font-normal",children:[(0,t.jsx)(d.A,{className:"h-3 w-3"}),k.location]}),(0,t.jsxs)(v.Ex,{className:"bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-1 font-normal",children:[(0,t.jsx)(m.A,{className:"h-3 w-3"}),k.type]}),(0,t.jsxs)(v.Ex,{className:"bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-1 font-normal",children:[(0,t.jsx)(g.A,{className:"h-3 w-3"}),k.salary]}),(0,t.jsxs)(v.Ex,{className:"bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-1 font-normal",children:[(0,t.jsx)(h,{className:"h-3 w-3"}),"Posted ",k.postedDate]})]})]}),(0,t.jsx)(j.w,{className:"my-6"}),(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h3",{className:"text-lg font-medium mb-3 text-gray-900",children:"Description"}),(0,t.jsx)("p",{className:"text-gray-700",children:k.description})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("h3",{className:"text-lg font-medium mb-3 text-gray-900",children:"Requirements"}),(0,t.jsx)("ul",{className:"space-y-2",children:k.requirements.map((e,a)=>(0,t.jsxs)("li",{className:"flex items-start gap-2",children:[(0,t.jsx)(y,{className:"h-5 w-5 text-launchpad-teal shrink-0 mt-0.5"}),(0,t.jsx)("span",{className:"text-gray-700",children:e})]},a))})]})]}),(0,t.jsxs)("div",{className:"mt-8 flex gap-4",children:[(0,t.jsx)(r.Button,{className:"flex-1 gap-2 bg-launchpad-blue hover:bg-launchpad-teal",children:"Apply Now"}),(0,t.jsx)(r.Button,{variant:"outline",className:"flex-1 gap-2",children:"Save Job"})]})]})})})]})]}),(0,t.jsx)(f.N,{open:s,onOpenChange:p,title:"Find Your Ideal Job",description:"Customize your search to discover the perfect opportunities",size:"lg",showFooter:!0,primaryActionText:"Apply Filters",onPrimaryAction:()=>S(A),secondaryActionText:"Cancel",onSecondaryAction:()=>p(!1),children:(0,t.jsx)(b.d,{onApplyFilters:S,initialFilters:A})})]})}},9922:(e,a,s)=>{Promise.resolve().then(s.bind(s,2027))}},e=>{var a=a=>e(e.s=a);e.O(0,[634,137,600,238,349,403,255,358],()=>a(9922)),_N_E=e.O()}]);