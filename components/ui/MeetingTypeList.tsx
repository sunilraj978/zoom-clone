"use client";
import React, { useState } from "react";
import HomeCard from "./homeCard";
import { useRouter } from "next/navigation";
import MeetingModel from "../MeetingModel";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "./textarea";
import ReactDatePicker from "react-datepicker";
import { Input } from "./input";

const MeetingTypeList = () => {
  const route = useRouter();
  const client = useStreamVideoClient();
  const { user } = useUser();
  const { toast } = useToast();

  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  });

  const router = useRouter();

  const [callDetails, setCallDetails] = useState<Call>();

  const createMeeting = async () => {
    if (!client || !user) return;

    try {
      const id = crypto.randomUUID();
      const call = client.call("default", id);

      if (!call) throw new Error("Failed to create call");

      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || "Instant Meeting";

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });

      setCallDetails(call);

      if (!values.description) {
        router.push(`/meetings/${call.id}`);
      }

      toast({
        title: "Meeting created successfully",
      });
    } catch (error) {
      toast({
        title: "Meeting created failed",
      });
      console.log(error);
    }
  };

  const [meeting, setMeeting] = useState<
    "isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
  >();

  const cards = [
    {
      img: "/icons/add-meeting.svg",
      title: "New Meeting",
      description: "Start an instant meeting",
      handleClick: () => setMeeting("isInstantMeeting"),
      className: "bg-orange-1",
    },
    {
      img: "/icons/schedule.svg",
      title: "Schedule Meeting",
      description: "Plan your meeting",
      handleClick: () => setMeeting("isScheduleMeeting"),
      className: "bg-blue-1",
    },
    {
      img: "/icons/recordings.svg",
      title: "View Recording",
      description: "Check out your recordings",
      handleClick: () => route.push("/recordings"),
      className: "bg-purple-1",
    },
    {
      img: "/icons/join-meeting.svg",
      title: "Join Meeting",
      description: "Join via invitationLink",
      handleClick: () => setMeeting("isJoiningMeeting"),
      className: "bg-yellow-1",
    },
  ];

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meetings/${callDetails?.id}`;

  return (
    <section
      className="grid grid-cols-1 gap-5
    md:grid-cols-2 xl:grid-cols-4"
    >
      {cards.map((card, index) => (
        <HomeCard
          key={index}
          img={card.img}
          title={card.title}
          description={card.description}
          handleClick={card.handleClick}
          className={card.className}
        />
      ))}

      {!callDetails ? (
        <MeetingModel
          isOpen={meeting === "isScheduleMeeting"}
          onClose={() => setMeeting(undefined)}
          title="Create Meeting"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-base text-normal leading-[22px] text-sky-2">
              Add a description
            </label>
            <Textarea
              className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) => {
                setValues({ ...values, description: e.target.value });
              }}
            />
          </div>
          <div className="flex flex-col w-full gap-2">
            <label className="text-base text-normal leading-[22px] text-sky-2">
              Select Date and Time
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded bg-dark-3 p- focus:outline-none"
            />
          </div>
        </MeetingModel>
      ) : (
        <MeetingModel
          isOpen={meeting === "isScheduleMeeting"}
          onClose={() => setMeeting(undefined)}
          title="Meeting Created"
          className="text-center"
          buttonText="Copy Meeting Link"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({ title: "Link Copied" });
          }}
          image="/icons/checked.svg"
          buttonIcon="icons/copy.svg"
        />
      )}

      <MeetingModel
        isOpen={meeting === "isInstantMeeting"}
        onClose={() => setMeeting(undefined)}
        title="Start an instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />

      <MeetingModel
        isOpen={meeting === "isJoiningMeeting"}
        onClose={() => setMeeting(undefined)}
        title="Type Meeting Link here"
        className="text-center"
        buttonText="Join Meeting"
        handleClick={() => route.push(values.link)}
      >
        <Input
          placeholder="Meeting Link"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
        />
      </MeetingModel>
    </section>
  );
};

export default MeetingTypeList;
