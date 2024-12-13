import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Call, StreamVideoClient, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface MeetingModelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  className?: string;
  children?: React.ReactNode;
  handleClick?: () => void;
  buttonText?: string;
  buttonIcon?: string;
  image?: string;
}

const MeetingModel = ({
  isOpen,
  onClose,
  title,
  className,
  children,
  handleClick,
  buttonText,
  image,
  buttonIcon,
}: MeetingModelProps) => {

  const router = useRouter()
  const client = useStreamVideoClient() 
  const {user} = useUser();
  const { toast } = useToast();

  const [values, setValues] = useState({
    dateTime: new Date(),
    description:'',
    link:''
  })

  const [callDetails, setCallDetails] = useState<Call>()

  const createMeeting = async() =>{
   if(!client || !user) return

   try{
    const id = crypto.randomUUID()
    const call = client.call('default', id)
    
    if(!call) throw new Error('Failed to create call')
    
    const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString()
    const description = values.description || 'Instant Meeting'

    await call.getOrCreate({
      data:{
        starts_at:startsAt,
        custom:{
          description
        }
      }
    })

    setCallDetails(call)

    if(!values.description){
      router.push(`/meetings/${call.id}`)
    }

    toast({
      title:"Meeting created successfully"
    })
    
      
   }catch(error){
    toast({
      title: "Meeting created failed",
    })
    console.log(error)
   }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex w-full flex-col max-w-[520px] gap-6 border-none bg-dark-1 px-6 py-9 text-white">
        <div className="flex flex-col gap-6">
          {image && (
            <div className="flex justify-center">
              <Image src={image} alt="image" width={72} height={72} />
            </div>
          )}
          <h1
            className={cn("max-sm:text-xl font-bold leading-[42px] text-3xl", className)}
          >
            {title}
          </h1>
          {children}
          <Button
            className="bg-blue-1 focus-visible:ring-0 focus-visible:ring-offset-0"
            onClick={handleClick}
          >
            {buttonIcon && (
              <Image
                src={buttonIcon}
                alt="button-icon"
                width={13}
                height={13}
              />
            )} 
            {buttonText || "Schedule Meeting"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingModel;
