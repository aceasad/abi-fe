const n=(r,e={})=>Object.keys(e).reduce((c,t)=>c.replace(new RegExp(`\\{${t}\\}`,"g"),String(e[t]??"")),r);export{n as i};
