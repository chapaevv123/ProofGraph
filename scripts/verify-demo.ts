import { createPublicClient } from "@arkiv-network/sdk"
import { tiramisu } from "@arkiv-network/sdk/chains"
import { http } from "viem"
import { rpcUrlFromEnv } from "../src/lib/arkiv.ts"
import { classifyFreshness } from "../src/lib/freshness.ts"
const ids={challengedProof:"0xe6f4fa57e0b124fa10ee1063221f30d9111339aebea3a791031932b5b65d74ef",challenge:"0x196124121f55ef730aa34a94ee6450883a70032f5914758b45750a60fb0973cd",successor:"0x3694b689eb70bc5039608199d43540ca98ee9dcb82b7837b18664ebabc9b47ea"} as const
const client=createPublicClient({chain:tiramisu,transport:http(rpcUrlFromEnv())})
const [old,challenge,next,timing]=await Promise.all([client.getEntity(ids.challengedProof),client.getEntity(ids.challenge),client.getEntity(ids.successor),client.getBlockTiming()])
const attr=(entity:typeof old,name:string)=>entity.attributes[name]?.value
console.log(JSON.stringify({block:timing.currentBlock.toString(),challenge:{entityId:challenge.key,targetProof:attr(challenge,"target_proof"),status:attr(challenge,"status"),reason:attr(challenge,"reason_class")},successor:{entityId:next.key,previousProof:attr(next,"previous_proof"),reverificationOf:attr(next,"reverification_of"),resolvesChallenge:attr(next,"resolves_challenge"),freshness:classifyFreshness(next.expiresAt,timing.currentBlock,timing.blockDuration)},linkageValid:attr(challenge,"target_proof")===old.key&&attr(next,"previous_proof")===old.key&&attr(next,"reverification_of")===old.key&&attr(next,"resolves_challenge")===challenge.key},null,2))
