import { describe, expect, it } from "vitest"
import { Entity, jsonToPayload } from "@arkiv-network/sdk"
import { key } from "@arkiv-network/sdk/attr"
import type { Hex } from "viem"
import { normalizeProofs } from "../src/lib/arkiv"
const creator="0x765fb7e6a0BdDDc29f57eeCE34AEda0Fb318805d" as Hex
const id=(n:number)=>`0x${n.toString(16).padStart(64,"0")}` as Hex
function entity(n:number,agent:string,capability:string,created:bigint,expires:bigint,previous?:Hex){return new Entity({key:id(n),creator,owner:creator,createdAt:created,expiresAt:expires,payload:jsonToPayload({task_summary:`task ${n}`,verification_summary:"passed",evidence_refs:[`hash:${n}`]}),attributes:{agent_id:{type:"str",value:agent},capability:{type:"str",value:capability},result:{type:"str",value:"verified_pass"},verifier_type:{type:"str",value:"deterministic_tests"},...(previous?{previous_proof:key(previous)}:{})} as never})}
describe("discovery normalization",()=>{
  it("supports multiple capabilities",()=>expect(normalizeProofs([entity(1,"a","python",1n,1000n),entity(2,"b","data",2n,1000n)],new Set(),10n,2,true).map(x=>x.capability).sort()).toEqual(["data","python"]))
  it("deduplicates in favor of the linked successor",()=>{const old=entity(1,"a","research",1n,1000n),next=entity(2,"a","research",2n,2000n,old.key!);const out=normalizeProofs([old,next],new Set(),10n,2,true);expect(out).toHaveLength(1);expect(out[0].entityId).toBe(next.key);expect(out[0].previousProof).toBe(old.key)})
  it("links and excludes challenges",()=>{const proof=entity(1,"a","research",1n,1000n),keys=new Set([proof.key!.toLowerCase()]);expect(normalizeProofs([proof],keys,10n,2,true)[0].challengeState).toBe("CHALLENGED");expect(normalizeProofs([proof],keys,10n,2,false)).toEqual([])})
  it("normalizes expiring state for cards",()=>expect(normalizeProofs([entity(1,"a","automation",1n,20n)],new Set(),10n,2,true)[0].freshnessState).toBe("EXPIRING_SOON"))
})
