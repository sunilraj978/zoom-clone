"use client"
import { useGetCalls } from "@/hooks/useGetCall";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import MeetingCard from "./MeetingCard";
import Loader from "../Loader";
import { toast } from "@/hooks/use-toast";

const CallList = ({ type }: { type: "ended" | "upcoming" | "recordings" }) => {
  const router = useRouter();
  const { endedCalls, upcomingCalls, getRecordingCalls, loading } =
    useGetCalls();
  const [recording, setRecording] = useState<CallRecording[]>([]);


  //fetch recording calls
  useEffect(()=>{

    const fetchRecording = async() =>{
        try{

            //Flat Map converts [[],[]] => []
            const callData = await Promise.all(getRecordingCalls.map((meeting)=> meeting.queryRecordings()))
            const recordings = callData.filter(call => call.recordings.length > 0)
            .flatMap(call => call.recordings)

            setRecording(recordings)
        }
        catch(error){
            toast({title:'Try again later'})
        }

    }
    if(type === 'recordings') fetchRecording()

  },[type, getRecordingCalls])

  const getCalls = () => {
    switch (type) {
      case "ended":
        return endedCalls;
      case "recordings":
        return recording;
      case "upcoming":
        return upcomingCalls;
      default:
        return [];
    }
  };

  const getNoCallMessage = () => {
    switch (type) {
      case "ended":
        return "No Ended Calls Available";
      case "recordings":
        return "No Recordings Available";
      case "upcoming":
        return "No Upcoming Calls Available";
      default:
        return "";
    }
  };

  const calls = getCalls();
  const noCalls = getNoCallMessage();

  if(loading) return <Loader />

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => (
          <MeetingCard
            key={(meeting as Call).id}
            icon={
              type === "ended"
                ? "/icons/previous.svg"
                : type === "upcoming"
                ? "/icons/upcoming.svg"
                : "/icons/recordings.svg"
            }
            title={
              (meeting as Call).state?.custom?.description ||
              (meeting as CallRecording).filename?.substring(0, 20) ||
              "Personal Meeting"
            }
            date={
              (meeting as Call).state?.startsAt?.toLocaleString() ||
              (meeting as CallRecording).start_time?.toLocaleString()
            }
            isPreviousMeeting={type === "ended"}
            link={
              type === "recordings"
                ? (meeting as CallRecording).url
                : `${process.env.NEXT_PUBLIC_BASE_URL}/meetings/${
                    (meeting as Call).id
                  }`
            }
            buttonIcon1={type === "recordings" ? "/icons/play.svg" : undefined}
            buttonText={type === "recordings" ? "Play" : "Start"}
            handleClick={
              type === "recordings"
                ? () => router.push(`${(meeting as CallRecording).url}`)
                : () => router.push(`/meetings/${(meeting as Call).id}`)
            }
          />
        ))
      ) : (
        <h1>{noCalls}</h1>
      )}
    </div>
  );
};

export default CallList;
