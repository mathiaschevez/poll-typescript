import type { NextPage } from 'next'
import React from 'react'
import Head from 'next/head'
import { prisma } from '../db/client'
import { trpc } from '../utils/trpc'

const QuestionCreator: React.FC = () => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const client = trpc.useContext()

  const { mutate, isLoading } = trpc.useMutation("questions.create", {
    onSuccess: () => {
      client.invalidateQueries("questions.get-all")
      if(!inputRef.current) return
      inputRef.current.value = ""
    }
  })

  return (
    <input 
      disabled={isLoading}
      ref={inputRef}
      onKeyDown={(event) => {
        if(event.key === 'Enter') {
          console.log("Enter!!!!", event.currentTarget.value)
          mutate({question: event.currentTarget.value})
          event.currentTarget.value = ""
        }
      }}
    ></input>
  )
}

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(['questions.get-all'])

  if(isLoading || !data) return <div>Loading...</div>

  console.log(data)

  return (
    <div className='p-6 flex flex-col'>
      <div className='flex flex-col'>
        <h1 className='text-2xl font-bold'>Questions</h1>
        {data.map((question) => (
          <div key={question.id} className='my-2'>
            <h1>{question.question}</h1>
          </div>
        ))} 
      </div>
      <QuestionCreator />
    </div>
  )
}

export default Home


