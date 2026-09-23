import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here=path.dirname(fileURLToPath(import.meta.url));
const appRoot=path.resolve(here,"..");
const repoRoot=path.resolve(appRoot,"..");
const wwwDir=path.join(appRoot,"www");
const bundleDir=path.join(wwwDir,"app-bundle");
const liveUrl="https://shoufhon.com/";

await fs.rm(bundleDir,{recursive:true,force:true});
await fs.mkdir(bundleDir,{recursive:true});

const rootEntries=await fs.readdir(repoRoot,{withFileTypes:true});
const rootJs=rootEntries
  .filter(entry=>entry.isFile() && entry.name.endsWith(".js"))
  .map(entry=>entry.name)
  .sort();

for(const file of rootJs){
  await fs.copyFile(
    path.join(repoRoot,file),
    path.join(bundleDir,file)
  );
}

const response=await fetch(liveUrl,{
  redirect:"follow",
  headers:{
    "User-Agent":"ShoufHon-Capacitor-Local-Performance-Test/0.1"
  }
});

if(!response.ok){
  throw new Error(
    "Could not snapshot "+liveUrl+" (HTTP "+response.status+")"
  );
}

let html=await response.text();

html=html.replace(
  /<base\b[^>]*>/gi,
  ""
);

html=html.replace(
  /<meta\b[^>]*http-equiv=["']Content-Security-Policy["'][^>]*>/gi,
  ""
);

html=html.replace(
  /<script\b[^>]*src=["'][^"']*ma7alak-pwa-client\.js[^"']*["'][^>]*>\s*<\/script>/gi,
  ""
);

let localizedCount=0;
html=html.replace(
  /https:\/\/cdn\.jsdelivr\.net\/gh\/hadi89mok\/ma7alak@[^/"']+\/([A-Za-z0-9._-]+\.js)(?:\?[^"']*)?/gi,
  (match,file)=>{
    if(!rootJs.includes(file)) return match;
    localizedCount++;
    return "https://localhost/app-bundle/"+file;
  }
);

html=html.replace(
  /https:\/\/raw\.githubusercontent\.com\/hadi89mok\/ma7alak\/[^/"']+\/([A-Za-z0-9._-]+\.js)(?:\?[^"']*)?/gi,
  (match,file)=>{
    if(!rootJs.includes(file)) return match;
    localizedCount++;
    return "https://localhost/app-bundle/"+file;
  }
);

const inject=`
  <base href="https://shoufhon.com/">
  <meta name="shoufhon-build-mode" content="capacitor-local-performance-test">
  <script>
    window.__SHOUFHON_NATIVE_APP__=true;
    window.__SHOUFHON_LOCAL_PERFORMANCE_TEST__=true;
    window.__SHOUFHON_WEB_ORIGIN__="https://shoufhon.com";
  </script>
`;

if(/<head\b[^>]*>/i.test(html)){
  html=html.replace(/<head\b[^>]*>/i,match=>match+inject);
}else{
  html=inject+html;
}

await fs.writeFile(
  path.join(wwwDir,"index.html"),
  html,
  "utf8"
);

console.log(
  JSON.stringify({
    mode:"capacitor-local-performance-test",
    source:liveUrl,
    htmlBytes:Buffer.byteLength(html),
    copiedRootJs:rootJs.length,
    localizedScriptReferences:localizedCount
  })
);
