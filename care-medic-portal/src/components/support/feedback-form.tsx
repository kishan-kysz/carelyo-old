/* eslint-disable no-undef */
import { Button, Rating, Textarea } from '@mantine/core'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import styles from '../../assets/styles/components/feedback.module.css'
import useProfile from '@hooks/use-profile'

function FeedbackForm() {
  const [rating, setRating] = useState(0)
  const { register, handleSubmit, reset } = useForm()
  const { user } = useProfile()

  const [submitted, setSubmit] = useState(false)

  /*  const {mutateAsync, isLoading} = useMutation((data) => createFeedback(data), {
      onError: (error) => showNotification({title: error.message}),
      onSuccess: () => {
        showNotification({
          title: 'Sent!',
          message: 'Thank you for your feedback!'
        });
        setRating(0);
        setSubmit(true);
        reset();
      }
    });*/

  const newFeedback = async (data) => {
    const actualData = {
      experienceSoFar: data.experienceSoFar,
      addRemoveFeatures: data.addRemoveFeatures,
      easeOfUse: rating,
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(newFeedback)}>
        <div className={styles['feedback-greeting']}>
          <h4>Hi, {user?.firstName}!</h4>
        </div>
        <h5 className={styles['feedback-heading']}>
          1. How has your experience been so far?
        </h5>
        <Textarea
          minRows={2}
          className={styles['feedback-details']}
          {...register('addRemoveFeatures')}
          placeholder="Enter your message here..."
          required={true}
        />
        <h5 className={styles['feedback-heading']}>
          2. Are there any features you would love us to add or remove to ease
          your work?
        </h5>
        <Textarea
          minRows={8}
          className={styles['feedback-details']}
          {...register('experienceSoFar')}
          placeholder="Enter your message here..."
          required={true}
        />
        <h5 className={styles['feedback-heading']}>
          3. Is the app easy to use?
        </h5>
        <p className={styles['feedback-text']}>
          1 = Strongly disagree, 5 = Strongly agree
        </p>
        <div className={styles['feedback-star']}>
          <Rating value={rating} onChange={setRating} />
        </div>
        <div className={styles['button-container']}>
          <Button type="submit" loading={false} disabled={submitted}>
            Send feedback
          </Button>
        </div>
      </form>
    </div>
  )
}

FeedbackForm.title = 'Feedback'

export default FeedbackForm
