//@ts-check
import React from 'react';
import NavButton from './NavButton';
import { Bars3BottomRightIcon } from "@heroicons/react/24/solid";
import { useAddress, useDisconnect } from '@thirdweb-dev/react';

//contains header image, "connected to wallet", logged in, logout button, 3bars
function Header() {
    const address = useAddress();
    const disconnect = useDisconnect();

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 justify-between items-center p-5">
        <div className="flex items-center space-x-2">
            <img
            className="rounded-none h-20 w-20"
            src="https://secureservercdn.net/45.40.150.54/mpp.652.myftpupload.com/wp-content/uploads/2021/11/MN512x512-60x60.png" 
            alt="" 
            />
            <div>
                <h1 className="text-lg text-black font-bold"> The Mint Nebula Draw</h1>
                <p className="text-xs text-[#b030ff] truncate flex-col">Connected to <br /> {address?.substring(0,5)}...
                {address?.substring(address.length, address.length - 5)}
                </p>
            </div>
        </div>

        <div className="flex-1 hidden md:flex md:col-span-3 justify-items-center justify-center round-md ">
            <div className="bg-[#13ffff] p-4 space-x-2 rounded-md flex">
                <div className='shadow-xl flex border border-[#b030ff] rounded-xl '>
                <NavButton isActive title="Logged in " />
                </div>
                <div className='shadow-xl border border-[#000000] bg-[#13faaa] text-center rounded-lg justify-items-center '>
                <NavButton onClick={disconnect} title="Logout" />                
                </div>
            </div>
        </div>

        <div className="flex flex-col ml-auto text-right disabled:bg-[#b030ff] rounded-md p-2 disabled:from-[#575650] disabled:text-[#414241] disabled:to-grey-600 ">
            <span className="md:hidden">
                <div className='shadow-xl text-center border border-[#13faaa]'>
                <NavButton isActive title="Logged in " />
                </div>
                <div className='shadow-xl justify-evenly text-center rounded-md border border-y-2 border-[#b030ff] mt-2'>
                <NavButton onClick={disconnect} title="Logout" />
                </div>
            </span>
        </div>
    </div>
  );
}
// 3Bars holds logout button in smaller window
export default Header