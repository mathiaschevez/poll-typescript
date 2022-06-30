import { useRouter } from 'next/router'
import { trpc } from '../../utils/trpc'

const QuestionsPageContent: React.FC<{ id: string }> = ({ id }) => {
  const { data, isLoading, error } = trpc.useQuery(['questions.get-by-id', { id }])

  if(!isLoading && !data) return <div>Question not found...</div>

  return( 
    <div className='flex flex-col p-6'>
      <h1 className='text-2xl font-bold'>{data?.question?.question}</h1>
      <div>
        {(data?.question?.options as string[])?.map(option => 
          <div key={option}>
            <h1>Option {option}</h1>
          </div>
        )}
      </div>
    </div>
  ) 
}

const QuestionPage = () => {
  const { query } = useRouter()
  const { id } = query


  if(!id || typeof id !== 'string'){
    return <div>No ID</div>
  }

  return (
    <div>
      <QuestionsPageContent id={id}/>
    </div>
  )
}

export default QuestionPage