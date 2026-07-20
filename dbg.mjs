import puppeteer from "puppeteer";
import http from "node:http";
import { promises as fs } from "node:fs";
import path from "node:path";
const DIST=path.resolve("dist");
const server=http.createServer(async (req,res)=>{
  const p=req.url.split("?")[0];
  let fp=path.join(DIST,p);
  try{const s=await fs.stat(fp); if(s.isDirectory()) fp=path.join(fp,"index.html");}catch{fp=path.join(DIST,"index.html");}
  const ext=path.extname(fp);
  const mimes={".html":"text/html",".js":"application/javascript",".css":"text/css",".woff2":"font/woff2",".svg":"image/svg+xml",".png":"image/png",".jpg":"image/jpeg",".webp":"image/webp",".json":"application/json"};
  try{const b=await fs.readFile(fp); res.writeHead(200,{"content-type":mimes[ext]||"text/plain"}); res.end(b);}catch{res.writeHead(404); res.end();}
});
await new Promise(r=>server.listen(5200,r));
const b=await puppeteer.launch({headless:true,executablePath:"/bin/chromium",args:["--no-sandbox"]});
const p=await b.newPage();
await p.evaluateOnNewDocument(()=>{window.__PRERENDER__=true;});
await p.goto("http://127.0.0.1:5200/?__prerender=1",{waitUntil:"domcontentloaded"});
try{await p.waitForFunction(()=>window.__PRERENDER_READY__===true,{timeout:15000});console.log("READY OK");}catch(e){console.log("READY TIMEOUT");}
const html=await p.content();
console.log("total len:",html.length);
const idx=html.indexOf('id="root"');
console.log("root idx:",idx);
console.log("root snippet:",html.slice(idx,idx+400));
await fs.writeFile("/tmp/render.html",html);
await b.close();server.close();
