import React from 'react'
import ContentProjectPage from './ContentProjectPage'

const ProjectPage = async ({params}: {params: Promise<{projectID: string}>}) => {

    const projectId = (await params).projectID
    
  return <ContentProjectPage projectId={projectId} />
}

export default ProjectPage