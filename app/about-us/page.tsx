import ServicesSection from '@/components/ServicesSection'
import WhyChooseUsSection from '@/components/WhyChooseUsSection'
import React from 'react'

export default function AboutUsPage() {
  return (
    <main className='flex flex-col items-center'>
      <div className='w-full max-w-[1920px]'>
        <WhyChooseUsSection/>
        <ServicesSection/>
      </div>
    </main>
  )
}
