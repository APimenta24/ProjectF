'use client';
import {useEffect} from 'react';
export default function PulsePwaSetup(){
 useEffect(()=>{
  if(!('serviceWorker' in navigator))return;
  // Registration does not ask for notification permission or subscribe to push.
  navigator.serviceWorker.register('/pulse-sw.js',{scope:'/pulse/'}).catch(()=>{});
 },[]);
 return null;
}
