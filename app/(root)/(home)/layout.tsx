import NavBar from '@/components/ui/navbar'
import SideBar from '@/components/ui/sidebar'
import { Metadata } from 'next';
import React from 'react'


export const metadata: Metadata = {
  title: "YOOM",
  description: "Video calling app",
  icons:{
    icon:'/icons/logo.svg'
  }
};

const HomeLayout = ({children}:{children: React.ReactNode}) => {
  return (
    <main className='relative'>
    <NavBar />

    <div className='flex'>
      <SideBar />
      <section className='flex min-h-screen flex-1 flex-col px-6 pb-6 pt-28 max-md:pb-14 sm:px-14'>
        <div className='w-full'>
          {children}
        </div>
      </section>
    </div>
   
   </main>
  )
}

export default HomeLayout