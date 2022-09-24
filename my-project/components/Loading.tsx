import React from 'react'
import PropagateLoader from "react-spinners/PropagateLoader";

function Loading() {
  return (
    <div className="bg-[#b030ff] h-screen flex flex-col items-center justify-center">
        <div className="flex items-center space-x-2 mb -10">
            <img
            className="rounded-full h-20 w-20" 
            src="https://secureservercdn.net/45.40.150.54/mpp.652.myftpupload.com/wp-content/uploads/2022/07/Forming39.gif?time=1662854433" 
            alt="" />
            <h1 
            className="text-lg text-[#13ffff] font-bold text-center justify-center flex">
            Forming the Mint Nebula Draw Lottery
            </h1>
        </div>
        <PropagateLoader color="white" size={30} />
    </div>
  )
}

export default Loading