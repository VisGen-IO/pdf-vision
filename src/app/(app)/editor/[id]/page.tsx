'use client'
import { TemplateEditor } from '@/components/template-editor'
import React from 'react'
import { mockTemplateData } from '../mock'


function page() {
  return (
    <TemplateEditor template_data={mockTemplateData}/>
  )
}

export default page