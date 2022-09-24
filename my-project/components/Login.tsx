import React from 'react'
import { ConnectWallet } from "@thirdweb-dev/react";

function Login() {
  return (
    <div className="bg-[#b030ff] min-h-screen flex flex-col items-center justify-center text-center">
        <div className="flex flex-col items-center mb-10">
            <img
                className="rounded-full h56 w-56 mb-10"
                src="https://secureservercdn.net/45.40.150.54/mpp.652.myftpupload.com/wp-content/uploads/2022/07/Forming39.gif?time=1662942175"
                alt=""
            />
            <h1 className="text-6xl text-[#13ffff] font-bold">Forming the Mint Nebula Draw</h1> <br />
            <h2 className="text-[#000000] text-2xl">Welcome Traveler.</h2>
            <h2 className='text-[#13ffff text-xl]'>To get started, Login with your wallet</h2> <br />
            <ConnectWallet accentColor="#13ffff" colorMode='dark'/> <br />
                <h1 className='text-[#13ffff] text-2xl'>Login to Polygon Network to play!</h1>

        </div>
    </div>
  );
};

export default Login;