import puppeteer from "puppeteer";
import http from "node:http";
import { promises as fs } from "node:fs";
import path from "node:path";
const DIST=path.resolve("dist");
const server=http.createServer(async (req,res)=>{
  const p=decodeURIComponent(req.url.split("?")[0]);
  let fp=path.join(DIST,p);
  try{const s=await fs.stat(fp); if(s.isDirectory()) fp=path.join(fp,"index.html");}catch{
    // Try direct route dir
    fp=path.join(DIST,p,"index.html");
    try{await fs.stat(fp);}catch{fp=path.join(DIST,"index.html");}
  }
  const ext=path.extname(fp);
  const mimes={".html":"text/html",".js":"application/javascript",".css":"text/css",".woff2":"font/woff2",".svg":"image/svg+xml",".png":"image/png",".jpg":"image/jpeg",".webp":"image/webp",".json":"application/json",".ico":"image/x-icon"};
  try{const b=await fs.readFile(fp); res.writeHead(200,{"content-type":mimes[ext]||"text/plain"}); res.end(b);}catch{res.writeHead(404); res.end();}
});
await new Promise(r=>server.listen(5201,r));
const routes=["/","/teachers","/subjects","/universities","/categories","/about","/contact","/faq"];
const b=await puppeteer.launch({headless:true,executablePath:"/bin/chromium",args:["--no-sandbox"]});
const out={};
for(const r of routes){
  const p=await b.newPage();
  const warnings=[];
  const errors=[];
  const supabase=[];
  p.on("console",m=>{
    const t=m.text();
    if(m.type()==="error") errors.push(t);
    if(t.includes("Hydration")||t.includes("hydrat")||t.includes("Warning:")) warnings.push(t);
  });
  p.on("request",req=>{if(req.url().includes("supabase.co")) supabase.push(req.url());});
  await p.goto(`http://127.0.0.1:5201${r}`,{waitUntil:"networkidle0",timeout:15000}).catch(()=>{});
  await new Promise(rz=>setTimeout(rz,800));
  const authStr=await p.evaluate(()=>Object.keys(localStorage).filter(k=>k.includes("supabase")).length);
  out[r]={warnings,errors:errors.slice(0,5),supabaseReqCount:supabase.length};
  await p.close();
}
await b.close(); server.close();
console.log(JSON.stringify(out,null,2));
