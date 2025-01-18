
import React from 'react'
import ContentPage from './ContentPage'

const userHomePage = async ({params}: {params: Promise<{name: string}>}) => {

    const name = (await params).name
    
    
  return (
    <ContentPage name={name} />
  )
}

export default userHomePage