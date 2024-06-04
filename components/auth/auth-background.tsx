import Image from "next/image";
import React from "react";
import bgAuthImg from '@/assets/images/bg.png'; 

export const AuthBackground = () => {
    return (
        <>
            <div
                    className="hidden bg-muted lg:block h-full"
                    // xl:min-h-[800px] lg:min-h-[600px]
                >
                    <Image
                        src={bgAuthImg}
                        alt="Image"
                        width="1920"
                        height="1080" 
                        className="h-full w-full object-cover dark:brightness-[0.8] " // dark:grayscale
                    />
                    <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 flex flex-col w-1/2">  
                        <h1 className="text-7xl font-bold font-mono flex flex-col justify-start items-start w-full pl-28">
                            <span>
                                Join Our 
                            </span>
                            <span className="pt-3" >
                                Community
                            </span>
                        </h1>
                        <p className="text-md font-normal font-mono flex flex-col justify-start items-start w-full px-28 pt-5" >
                            Our goal is to establish a  platform where undergraduates can get hands-on experience in electronics and provide recycled electronics for their projects.
                        </p>
                    </div>
                </div>
        </>
    )
} 

