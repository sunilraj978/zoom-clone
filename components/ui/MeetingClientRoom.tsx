import { cn } from "@/lib/utils";
import {
  CallControls,
  CallingState,
  CallParticipantsList,
  CallStatsButton,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import React, { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutList, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import EndCallButton from "./EndCallButton";
import Loader from "../Loader";

type CallLayoutType = "grid" | "speaker-right" | "speaker-left";

const MeetingClientRoom = () => {
  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");

  const router = useRouter()
  const searchParams = useSearchParams()

  const [showParticipants, setShowParticipants] = useState(false);
  const isPersonalRoom = !!searchParams.get('personal')

  const {useCallCallingState} = useCallStateHooks()
  const callingState = useCallCallingState();

  if(callingState !== CallingState.JOINED) return <Loader />


  const CallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;
      case "speaker-right":
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden text-white">
      <div className="relative flex justify-center size-full items-center">
        <div className="flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>
        <div
          className={cn("h-[calc(100vh-86px)] hidden ml-2", {
            "show-block": showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>

      <div className="fixed bottom-0 flex flex-wrap w-full items-center justify-center gap-5">
        {/* Add the theme css in the layout to work the callControl button setting */}
        <CallControls onLeave={()=> router.push('/')} />

        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-2 py-2 hover:bg-[#4c535b]">
              <LayoutList size={20} className="text-white" />
            </DropdownMenuTrigger>
          </div>

          <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
            {
              ['Grid','Speaker-left','Speaker-right'].map((item,index)=>(
                <div key={index}>
                  <DropdownMenuItem className="cursor-pointer" onClick={()=>{
                    setLayout(item.toLowerCase() as CallLayoutType)
                  }}>
                    {item}
                  </DropdownMenuItem>
                </div>
              ))
            }
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Display the call Statistics */}
        <CallStatsButton />

        <button onClick={()=>setShowParticipants((prev)=> !prev)}>
          <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            <Users size={20} className="text-white"/>
          </div>
        </button>

        {/* Close the call */}
      
      {
        !isPersonalRoom && <EndCallButton />
      }

      </div>
    </section>
  );
};

export default MeetingClientRoom;
