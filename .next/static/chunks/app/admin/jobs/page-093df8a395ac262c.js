(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[711],{3210:(e,a,t)=>{"use strict";t.d(a,{A:()=>s});let s=(0,t(1018).A)("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]])},3509:(e,a,t)=>{"use strict";t.d(a,{D4:()=>r,Dv:()=>n,kl:()=>d,n5:()=>c});let s={USERS:"launchpad_users",JOBS:"launchpad_jobs",APPLICATIONS:"launchpad_applications",PARTNERS:"launchpad_partners",EVENTS:"launchpad_events",APP_STATUS_HISTORY:"launchpad_app_status_history",CURRENT_USER:"launchpad_current_user"};function i(e,a){let t=localStorage.getItem(e);if(!t)return a;try{return JSON.parse(t)}catch(t){return console.error("Error parsing ".concat(e," from localStorage:"),t),a}}function l(e,a){localStorage.setItem(e,JSON.stringify(a))}let n={getAll:()=>i(s.USERS,[]),getById:e=>i(s.USERS,[]).find(a=>a.user_id===e),create:e=>{let a=i(s.USERS,[]),t={...e,user_id:a.length>0?Math.max(...a.map(e=>e.user_id))+1:1,created_at:new Date().toISOString()};return a.push(t),l(s.USERS,a),t},update:e=>{let a=i(s.USERS,[]),t=a.findIndex(a=>a.user_id===e.user_id);return -1!==t?(a[t]=e,l(s.USERS,a),e):null},delete:e=>{let a=i(s.USERS,[]).filter(a=>a.user_id!==e);l(s.USERS,a)},login:(e,a)=>{let t=i(s.USERS,[]).find(t=>t.username===e&&t.password===a);return t&&l(s.CURRENT_USER,t),t},logout:()=>{localStorage.removeItem(s.CURRENT_USER)},getCurrentUser:()=>i(s.CURRENT_USER,null)},r={getAll:()=>i(s.JOBS,[]),getById:e=>i(s.JOBS,[]).find(a=>a.job_id===e),getByPartnerId:e=>i(s.JOBS,[]).filter(a=>a.partner_id===e),search:e=>{let a=i(s.JOBS,[]),t=e.toLowerCase();return a.filter(e=>{var a,s;return e.title.toLowerCase().includes(t)||e.company.toLowerCase().includes(t)||e.location.toLowerCase().includes(t)||(null===(a=e.description)||void 0===a?void 0:a.toLowerCase().includes(t))||(null===(s=e.tags)||void 0===s?void 0:s.some(e=>e.toLowerCase().includes(t)))})},create:e=>{let a=i(s.JOBS,[]),t={...e,job_id:a.length>0?Math.max(...a.map(e=>e.job_id))+1:1,created_at:new Date().toISOString()};return a.push(t),l(s.JOBS,a),t},update:e=>{let a=i(s.JOBS,[]),t=a.findIndex(a=>a.job_id===e.job_id);return -1!==t?(a[t]=e,l(s.JOBS,a),e):null},delete:e=>{let a=i(s.JOBS,[]).filter(a=>a.job_id!==e);l(s.JOBS,a)}},d={getAll:()=>i(s.APPLICATIONS,[]),getById:e=>i(s.APPLICATIONS,[]).find(a=>a.application_id===e),getByUserId:e=>i(s.APPLICATIONS,[]).filter(a=>a.user_id===e),getByJobId:e=>i(s.APPLICATIONS,[]).filter(a=>a.job_id===e),create:e=>{let a=i(s.APPLICATIONS,[]),t=new Date().toISOString(),n={...e,application_id:a.length>0?Math.max(...a.map(e=>e.application_id))+1:1,applied_at:t,status_updated_at:t};a.push(n),l(s.APPLICATIONS,a);let r=i(s.APP_STATUS_HISTORY,[]),d={app_history_id:r.length>0?Math.max(...r.map(e=>e.app_history_id))+1:1,application_id:n.application_id,status:n.status,changed_at:t};return r.push(d),l(s.APP_STATUS_HISTORY,r),n},updateStatus:(e,a)=>{let t=i(s.APPLICATIONS,[]),n=t.findIndex(a=>a.application_id===e);if(-1!==n){let r=new Date().toISOString();if(t[n].status===a)return t[n];t[n].status=a,t[n].status_updated_at=r,l(s.APPLICATIONS,t);let d=i(s.APP_STATUS_HISTORY,[]),c={app_history_id:d.length>0?Math.max(...d.map(e=>e.app_history_id))+1:1,application_id:e,status:a,changed_at:r};return d.push(c),l(s.APP_STATUS_HISTORY,d),t[n]}return null},update:e=>{let a=i(s.APPLICATIONS,[]),t=a.findIndex(a=>a.application_id===e.application_id);if(-1!==t){let n=a[t].status,r=e.status,d=new Date().toISOString();if(a[t]={...e,status_updated_at:n!==r?d:a[t].status_updated_at},l(s.APPLICATIONS,a),n!==r){let a=i(s.APP_STATUS_HISTORY,[]),t={app_history_id:a.length>0?Math.max(...a.map(e=>e.app_history_id))+1:1,application_id:e.application_id,status:r,changed_at:d};a.push(t),l(s.APP_STATUS_HISTORY,a)}return a[t]}return null},delete:e=>{let a=i(s.APPLICATIONS,[]).filter(a=>a.application_id!==e);l(s.APPLICATIONS,a);let t=i(s.APP_STATUS_HISTORY,[]).filter(a=>a.application_id!==e);l(s.APP_STATUS_HISTORY,t)},getStatusHistory:e=>i(s.APP_STATUS_HISTORY,[]).filter(a=>a.application_id===e).sort((e,a)=>new Date(a.changed_at).getTime()-new Date(e.changed_at).getTime())};function c(){if(i(s.USERS,[]).length>0)return;let e=[{user_id:1,status:"active",username:"admin",password:"admin123",isAdmin:!0,program:"admin",created_at:new Date().toISOString()},{user_id:2,status:"active",username:"applicant",password:"applicant123",isAdmin:!1,program:"web_development",created_at:new Date().toISOString()}];l(s.USERS,e),l(s.PARTNERS,[{partner_id:1,name:"Tech Innovators",description:"A leading tech company focused on innovation and growth.",industry:"Technology",location:"Remote",jobs_available:3,applicants:0,applicants_hired:0},{partner_id:2,name:"Creative Solutions",description:"Design and creative agency with a focus on user experience.",industry:"Design",location:"Philadelphia, PA",jobs_available:2,applicants:0,applicants_hired:0}]);let a=[{job_id:1,job_type:"full_time",title:"Frontend Developer",description:"We're looking for a skilled frontend developer experienced in React and TypeScript.",company:"Tech Innovators",website:"https://techinnovators.example.com",location:"Remote",partner_id:1,created_at:new Date().toISOString(),tags:["React","TypeScript","Frontend","Remote"]},{job_id:2,job_type:"full_time",title:"UX Designer",description:"Join our design team to create beautiful user experiences.",company:"Creative Solutions",website:"https://creativesolutions.example.com",location:"Philadelphia, PA",partner_id:2,created_at:new Date().toISOString(),tags:["UX","UI","Design","Figma"]},{job_id:3,job_type:"part_time",title:"Backend Engineer",description:"Part-time role helping build our scalable backend infrastructure.",company:"Tech Innovators",website:"https://techinnovators.example.com",location:"Remote",partner_id:1,created_at:new Date().toISOString(),tags:["Node.js","Express","MongoDB","Backend","Remote"]}];l(s.JOBS,a);let t=new Date,n=[{event_id:1,title:"Resume Workshop",description:"Learn how to craft a perfect resume for tech companies.",event_date:new Date(t.getFullYear(),t.getMonth(),t.getDate()+7).toISOString(),created_at:new Date().toISOString()},{event_id:2,title:"Tech Interview Prep",description:"Practice technical interview questions and get feedback.",event_date:new Date(t.getFullYear(),t.getMonth(),t.getDate()+14).toISOString(),created_at:new Date().toISOString()}];l(s.EVENTS,n)}},3931:(e,a,t)=>{"use strict";t.d(a,{A:()=>s});let s=(0,t(1018).A)("FileSpreadsheet",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M8 13h2",key:"yr2amv"}],["path",{d:"M14 13h2",key:"un5t4a"}],["path",{d:"M8 17h2",key:"2yhykz"}],["path",{d:"M14 17h2",key:"10kma7"}]])},4817:(e,a,t)=>{Promise.resolve().then(t.bind(t,7001))},7001:(e,a,t)=>{"use strict";t.r(a),t.d(a,{default:()=>_});var s=t(8081),i=t(2149),l=t(2912),n=t(4955),r=t(3809),d=t(4651),c=t(3931),o=t(2950),p=t(5808),m=t(3210),h=t(1018);let x=(0,h.A)("SquarePen",[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]]),u=(0,h.A)("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);var g=t(3509),j=t(9690),y=t(9668),N=t(7687),S=t(9303),b=t(9983);function _(){let[e,a]=(0,i.useState)([]),[t,h]=(0,i.useState)(null),[_,f]=(0,i.useState)(""),[v,w]=(0,i.useState)(!0),[A,T]=(0,i.useState)(!1),[C,I]=(0,i.useState)({}),[P,O]=(0,i.useState)({}),[R,k]=(0,i.useState)(!1),[E,U]=(0,i.useState)(!1),[D,B]=(0,i.useState)(!1);(0,i.useEffect)(()=>{(async()=>{w(!0);let e=g.D4.getAll(),s=g.kl.getAll(),i={};s.forEach(e=>{i[e.job_id]?i[e.job_id]++:i[e.job_id]=1}),a(e),O(i),e.length>0&&!t&&h(e[0]),w(!1)})()},[]);let L=e.filter(e=>{var a,t;if(!_)return!0;let s=_.toLowerCase();return e.title.toLowerCase().includes(s)||e.company.toLowerCase().includes(s)||(null===(a=e.description)||void 0===a?void 0:a.toLowerCase().includes(s))||(null===(t=e.location)||void 0===t?void 0:t.toLowerCase().includes(s))}),J=e=>{h(e)},M=e=>{I(e),T(!1)};return(0,s.jsxs)(l.N,{isAdmin:!0,children:[(0,s.jsxs)("div",{className:"container py-6 px-4 mx-auto",children:[(0,s.jsxs)("div",{className:"mb-8",children:[(0,s.jsx)("h1",{className:"text-2xl font-bold text-gray-900",children:"Job Listings"}),(0,s.jsx)("p",{className:"text-gray-500 mt-1",children:"Manage all job postings and track applications"})]}),(0,s.jsx)(n.Card,{className:"mb-6",children:(0,s.jsx)(n.CardContent,{className:"p-4",children:(0,s.jsxs)("div",{className:"flex flex-col md:flex-row items-start md:items-center justify-between gap-4",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("h3",{className:"font-medium text-base mb-1",children:"Quick Job Import"}),(0,s.jsx)("p",{className:"text-sm text-gray-500",children:"Scrape job listings from external sites or upload in bulk from CSV files"})]}),(0,s.jsxs)("div",{className:"flex flex-wrap gap-2",children:[(0,s.jsxs)(r.Button,{variant:"outline",className:"text-sm gap-1",onClick:()=>B(!0),children:[(0,s.jsx)(c.A,{className:"h-4 w-4"}),"Upload CSV"]}),(0,s.jsxs)(r.Button,{className:"text-sm gap-1 bg-launchpad-blue hover:bg-launchpad-teal text-white",onClick:()=>window.location.href="/admin/dashboard?tab=import",children:[(0,s.jsx)(o.A,{className:"h-4 w-4"}),"Web Scraping"]})]})]})})}),(0,s.jsxs)("div",{className:"flex flex-wrap gap-3 mb-6",children:[(0,s.jsxs)("div",{className:"relative flex-1 min-w-[260px]",children:[(0,s.jsx)(o.A,{className:"absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"}),(0,s.jsx)(d.p,{placeholder:"Search jobs, companies, or keywords...",className:"pl-9",value:_,onChange:e=>f(e.target.value)})]}),(0,s.jsxs)("div",{className:"flex gap-3",children:[(0,s.jsxs)(r.Button,{variant:"outline",className:"gap-1",onClick:()=>T(!0),children:[(0,s.jsx)(p.A,{className:"h-4 w-4"}),"Filter"]}),(0,s.jsxs)(r.Button,{className:"gap-1 bg-launchpad-blue hover:bg-launchpad-teal text-white",children:[(0,s.jsx)(m.A,{className:"h-4 w-4"}),"Add Job"]})]})]}),(0,s.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-6",children:[(0,s.jsxs)(n.Card,{className:"lg:col-span-1 max-h-[calc(100vh-220px)] overflow-hidden flex flex-col",children:[(0,s.jsxs)(n.CardHeader,{className:"pb-2",children:[(0,s.jsx)(n.CardTitle,{children:"Job Listings"}),(0,s.jsxs)(n.CardDescription,{children:[L.length," jobs found"]})]}),(0,s.jsx)(n.CardContent,{className:"flex-1 overflow-auto p-3",children:v?(0,s.jsx)("div",{className:"space-y-3",children:Array.from({length:6}).map((e,a)=>(0,s.jsx)(n.Card,{className:"animate-pulse",children:(0,s.jsx)(n.CardContent,{className:"p-3",children:(0,s.jsxs)("div",{className:"flex gap-3",children:[(0,s.jsx)("div",{className:"h-12 w-12 rounded bg-gray-200"}),(0,s.jsxs)("div",{className:"flex-1 space-y-2",children:[(0,s.jsx)("div",{className:"h-5 bg-gray-200 rounded w-3/4"}),(0,s.jsx)("div",{className:"h-4 bg-gray-200 rounded w-1/2"})]})]})})},a))}):0===L.length?(0,s.jsx)("div",{className:"text-center py-12",children:(0,s.jsx)("p",{className:"text-gray-500",children:"No jobs found matching your criteria"})}):(0,s.jsx)("div",{className:"space-y-3",children:L.map(e=>(0,s.jsx)(n.Card,{className:(0,N.cn)("cursor-pointer hover:shadow transition-shadow",(null==t?void 0:t.job_id)===e.job_id?"ring-2 ring-launchpad-blue":""),onClick:()=>J(e),children:(0,s.jsx)(n.CardContent,{className:"p-3",children:(0,s.jsxs)("div",{className:"flex gap-3",children:[(0,s.jsx)("div",{className:"h-12 w-12 rounded bg-gray-100 flex items-center justify-center overflow-hidden",children:(0,s.jsx)(y.a,{src:"/company-logos/".concat(e.company.toLowerCase().replace(/\s+/g,"-"),".png"),alt:e.company,width:40,height:40,className:"object-contain",fallbackSrc:"/placeholder-logo.png"})}),(0,s.jsxs)("div",{className:"flex-1",children:[(0,s.jsx)("h3",{className:"font-medium text-gray-900 line-clamp-1",children:e.title}),(0,s.jsx)("p",{className:"text-sm text-gray-500 line-clamp-1",children:e.company}),(0,s.jsxs)("div",{className:"flex justify-between items-center mt-1",children:[(0,s.jsx)("span",{className:"text-xs text-gray-400",children:e.location}),(0,s.jsxs)(j.Ex,{className:"bg-launchpad-blue/10 text-launchpad-blue text-xs",children:[P[e.job_id]||0," applicants"]})]})]})]})})},e.job_id))})})]}),(0,s.jsx)(n.Card,{className:"lg:col-span-2 max-h-[calc(100vh-220px)] overflow-auto",children:v?(0,s.jsxs)("div",{className:"animate-pulse p-6 space-y-4",children:[(0,s.jsx)("div",{className:"h-8 bg-gray-200 rounded w-1/2 mb-6"}),(0,s.jsxs)("div",{className:"flex gap-3 mb-6",children:[(0,s.jsx)("div",{className:"h-16 w-16 rounded bg-gray-200"}),(0,s.jsxs)("div",{className:"flex-1 space-y-2",children:[(0,s.jsx)("div",{className:"h-5 bg-gray-200 rounded w-3/4"}),(0,s.jsx)("div",{className:"h-4 bg-gray-200 rounded w-1/2"})]})]}),(0,s.jsxs)("div",{className:"space-y-2",children:[(0,s.jsx)("div",{className:"h-4 bg-gray-200 rounded w-full"}),(0,s.jsx)("div",{className:"h-4 bg-gray-200 rounded w-full"}),(0,s.jsx)("div",{className:"h-4 bg-gray-200 rounded w-3/4"})]})]}):t?(0,s.jsxs)("div",{className:"p-6",children:[(0,s.jsxs)("div",{className:"flex justify-between items-start mb-6",children:[(0,s.jsx)("h2",{className:"text-2xl font-bold",children:t.title}),(0,s.jsxs)("div",{className:"flex gap-2",children:[(0,s.jsxs)(r.Button,{variant:"outline",size:"sm",className:"gap-1",onClick:()=>U(!0),children:[(0,s.jsx)(x,{className:"h-4 w-4"})," Edit"]}),(0,s.jsxs)(r.Button,{variant:"danger",size:"sm",className:"gap-1 bg-red-50 text-red-600 hover:bg-red-100 border-red-200",onClick:()=>k(!0),children:[(0,s.jsx)(u,{className:"h-4 w-4"})," Delete"]})]})]}),(0,s.jsxs)("div",{className:"flex items-center gap-4 mb-6",children:[(0,s.jsx)("div",{className:"h-16 w-16 rounded bg-gray-100 flex items-center justify-center overflow-hidden",children:(0,s.jsx)(y.a,{src:"/company-logos/".concat(t.company.toLowerCase().replace(/\s+/g,"-"),".png"),alt:t.company,width:60,height:60,className:"object-contain",fallbackSrc:"/placeholder-logo.png"})}),(0,s.jsxs)("div",{children:[(0,s.jsx)("h3",{className:"font-medium text-lg",children:t.company}),(0,s.jsx)("p",{className:"text-gray-500",children:t.location})]})]}),(0,s.jsxs)("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-4 mb-6",children:[(0,s.jsxs)("div",{className:"bg-gray-50 p-3 rounded",children:[(0,s.jsx)("p",{className:"text-xs text-gray-500",children:"Job Type"}),(0,s.jsx)("p",{className:"font-medium",children:t.job_type.replace("_"," ")})]}),(0,s.jsxs)("div",{className:"bg-gray-50 p-3 rounded",children:[(0,s.jsx)("p",{className:"text-xs text-gray-500",children:"Experience"}),(0,s.jsx)("p",{className:"font-medium",children:t.experience||"Not specified"})]}),(0,s.jsxs)("div",{className:"bg-gray-50 p-3 rounded",children:[(0,s.jsx)("p",{className:"text-xs text-gray-500",children:"Salary Range"}),(0,s.jsx)("p",{className:"font-medium",children:t.salary_range||"Not specified"})]}),(0,s.jsxs)("div",{className:"bg-gray-50 p-3 rounded",children:[(0,s.jsx)("p",{className:"text-xs text-gray-500",children:"Applications"}),(0,s.jsx)("p",{className:"font-medium",children:P[t.job_id]||0})]})]}),(0,s.jsxs)("div",{className:"mb-6",children:[(0,s.jsx)("h3",{className:"font-medium mb-2",children:"Job Description"}),(0,s.jsx)("div",{className:"text-gray-700 whitespace-pre-line",children:t.description||"No description provided"})]}),(0,s.jsxs)("div",{className:"mb-6",children:[(0,s.jsx)("h3",{className:"font-medium mb-2",children:"Requirements"}),(0,s.jsx)("div",{className:"text-gray-700 whitespace-pre-line",children:t.requirements||"No requirements specified"})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("h3",{className:"font-medium mb-2",children:"Benefits"}),(0,s.jsx)("div",{className:"text-gray-700 whitespace-pre-line",children:t.benefits||"No benefits specified"})]})]}):(0,s.jsxs)("div",{className:"flex flex-col items-center justify-center h-full p-6 text-center",children:[(0,s.jsx)("div",{className:"rounded-full bg-gray-100 p-4 mb-4",children:(0,s.jsx)(o.A,{className:"h-10 w-10 text-gray-400"})}),(0,s.jsx)("h3",{className:"text-xl font-medium mb-2",children:"No Job Selected"}),(0,s.jsx)("p",{className:"text-gray-500 max-w-sm mb-4",children:"Please select a job from the list to view its details"}),(0,s.jsxs)(r.Button,{className:"bg-launchpad-blue hover:bg-launchpad-teal text-white",children:[(0,s.jsx)(m.A,{className:"h-4 w-4 mr-2"})," Add New Job"]})]})})]})]}),(0,s.jsx)(S.N,{open:A,onOpenChange:T,title:"Filter Jobs",description:"Find specific jobs by criteria",size:"md",showFooter:!0,primaryActionText:"Apply Filters",onPrimaryAction:()=>M(C),secondaryActionText:"Reset",onSecondaryAction:()=>I({}),children:(0,s.jsx)(b.d,{onApplyFilters:M,initialFilters:C})}),(0,s.jsx)(S.N,{open:R,onOpenChange:k,title:"Delete Job",description:"Are you sure you want to delete this job posting? This action cannot be undone.",size:"sm",showFooter:!0,primaryActionText:"Delete",onPrimaryAction:()=>{t&&(g.D4.delete(t.job_id),a(e=>e.filter(e=>e.job_id!==t.job_id)),h(null),k(!1))},secondaryActionText:"Cancel",onSecondaryAction:()=>k(!1),children:t&&(0,s.jsxs)("div",{className:"py-2",children:[(0,s.jsxs)("p",{className:"mb-2",children:[(0,s.jsx)("strong",{children:"Title:"})," ",t.title]}),(0,s.jsxs)("p",{children:[(0,s.jsx)("strong",{children:"Company:"})," ",t.company]})]})}),(0,s.jsx)(S.N,{open:E,onOpenChange:U,title:"Edit Job",description:"Update job posting details",size:"lg",showFooter:!0,primaryActionText:"Save Changes",onPrimaryAction:()=>U(!1),secondaryActionText:"Cancel",onSecondaryAction:()=>U(!1),children:(0,s.jsx)("div",{className:"py-4",children:(0,s.jsx)("p",{className:"text-center text-gray-500",children:"Job edit form would go here"})})}),(0,s.jsx)(S.N,{open:D,onOpenChange:B,title:"Import Jobs from CSV",description:"Upload multiple job listings at once",size:"md",showFooter:!0,primaryActionText:"Import Jobs",onPrimaryAction:()=>{alert("5 jobs have been imported successfully!"),B(!1)},secondaryActionText:"Cancel",onSecondaryAction:()=>B(!1),children:(0,s.jsxs)("div",{className:"py-4 space-y-4",children:[(0,s.jsx)("div",{className:"border-2 border-dashed border-gray-200 rounded-md p-6 text-center",children:(0,s.jsxs)("div",{className:"flex flex-col items-center justify-center",children:[(0,s.jsx)(c.A,{className:"h-10 w-10 text-gray-300 mb-2"}),(0,s.jsx)("h4",{className:"font-medium mb-1",children:"Drop your CSV file here"}),(0,s.jsx)("p",{className:"text-sm text-gray-500 mb-4",children:"Make sure to follow the required format"}),(0,s.jsx)(r.Button,{variant:"outline",size:"sm",children:"Browse Files"})]})}),(0,s.jsxs)("div",{className:"bg-launchpad-blue/5 p-4 rounded-md",children:[(0,s.jsx)("h4",{className:"font-medium mb-2 text-sm",children:"CSV Format Requirements"}),(0,s.jsxs)("ul",{className:"text-xs text-gray-600 space-y-1 list-disc pl-4",children:[(0,s.jsx)("li",{children:"First row must contain headers: Title, Company, Location, Type, Description"}),(0,s.jsx)("li",{children:"All jobs must have at least Title, Company and Location"}),(0,s.jsx)("li",{children:"Valid job types: full_time, part_time, contract, internship"}),(0,s.jsx)("li",{children:"Maximum 100 jobs per import"})]})]}),(0,s.jsx)("div",{className:"text-center",children:(0,s.jsx)(r.Button,{variant:"link",size:"sm",className:"text-xs",children:"Download Template"})})]})})]})}}},e=>{var a=a=>e(e.s=a);e.O(0,[279,306,136,653,801,497,954,358],()=>a(4817)),_N_E=e.O()}]);