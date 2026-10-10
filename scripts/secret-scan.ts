import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
const files=execFileSync("git",["ls-files","--cached","--others","--exclude-standard"],{encoding:"utf8"}).split(/\r?\n/).filter(Boolean)
const findings:string[]=[]
const patterns=[/(?:PRIVATE_KEY|MNEMONIC|SEED_PHRASE|API_TOKEN|TERMIX[^=\s]*|PULSE[^=\s]*)\s*[=:]\s*["']?(?!$|<|your|example)[^\s"']{8,}/gi,/Authorization\s*:\s*(?:Bearer|Basic)\s+[A-Za-z0-9._~+/=-]{12,}/gi,/\b(?:abandon\s+){11}about\b/gi]
for(const file of files){if(/^\.env(?:\.|$)/.test(file)&&file!==".env.example")findings.push(`${file}: environment file would be published`);if(file==="scripts/secret-scan.ts"||/\.(png|jpg|jpeg|gif|ico|woff2?)$/i.test(file))continue;const body=readFileSync(file,"utf8");for(const pattern of patterns){pattern.lastIndex=0;if(pattern.test(body))findings.push(`${file}: credential pattern`)}}
if(findings.length){console.error(JSON.stringify({ok:false,findings},null,2));process.exitCode=1}else console.log(JSON.stringify({ok:true,filesScanned:files.length,ignoredLocalEnv:true},null,2))
