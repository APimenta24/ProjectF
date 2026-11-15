/**
 * Cofre local Pulse. AES-256-GCM, PBKDF2-SHA-256 (310 000 iterações),
 * salt aleatório de 16 bytes e IV aleatório de 12 bytes por gravação.
 * A frase-passe nunca é persistida. Não recuperável se esquecida.
 * Só protege os dados cifrados deste cofre; não cifra todo o Pulse.
 */
const enc=new TextEncoder(),dec=new TextDecoder();
const b64=(bytes:Uint8Array)=>btoa(Array.from(bytes,x=>String.fromCharCode(x)).join(''));
const bytes=(value:string)=>Uint8Array.from(atob(value),c=>c.charCodeAt(0));
export type Vault={v:1;alg:'AES-GCM';kdf:'PBKDF2-SHA-256';iterations:310000;salt:string;iv:string;data:string};
export const isVault=(x:unknown):x is Vault=>{if(!x||typeof x!=='object')return false;const v=x as Record<string,unknown>;return v.v===1&&v.alg==='AES-GCM'&&v.kdf==='PBKDF2-SHA-256'&&v.iterations===310000&&['salt','iv','data'].every(k=>typeof v[k]==='string'&&(v[k] as string).length>0)};
const derive=async(passphrase:string,salt:Uint8Array)=>{const material=await crypto.subtle.importKey('raw',enc.encode(passphrase),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt:salt as BufferSource,iterations:310000,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])};
export async function encryptVault(value:unknown,passphrase:string,saltValue?:string):Promise<Vault>{if(passphrase.length<12)throw Error('passphrase');if(!globalThis.crypto?.subtle)throw Error('crypto');const salt=saltValue?bytes(saltValue):crypto.getRandomValues(new Uint8Array(16));if(salt.length!==16)throw Error('salt');const iv=crypto.getRandomValues(new Uint8Array(12));const key=await derive(passphrase,salt);const encrypted=await crypto.subtle.encrypt({name:'AES-GCM',iv:iv as BufferSource},key,enc.encode(JSON.stringify(value)));return{v:1,alg:'AES-GCM',kdf:'PBKDF2-SHA-256',iterations:310000,salt:b64(salt),iv:b64(iv),data:b64(new Uint8Array(encrypted))}}
export async function decryptVault<T>(vault:Vault,passphrase:string):Promise<T>{if(!isVault(vault)||!globalThis.crypto?.subtle)throw Error('vault');const salt=bytes(vault.salt),iv=bytes(vault.iv);if(salt.length!==16||iv.length!==12)throw Error('vault');const key=await derive(passphrase,salt);return JSON.parse(dec.decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:iv as BufferSource},key,bytes(vault.data) as BufferSource))) as T}
