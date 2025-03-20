import { useState } from 'react'
import { BASE_URL } from '../../config'
import { getToken } from '../../utils/auth'

const FeedbackForm = ({ doctorId }) => {
    const [rating, setRating] = useState(0)
    const [reviewText, setReviewText] = useState('')

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            const res = await fetch(`${BASE_URL}/doctors/${doctorId}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify({ rating, reviewText })
            })

            if (!res.ok) {
                throw new Error('Failed to submit feedback')
            }

            // Reset form
            setRating(0)
            setReviewText('')
            
        } catch (error) {
            console.error('Error submitting feedback:', error)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <input
                    type="number"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={e => setRating(Number(e.target.value))}
                    required
                />
                <textarea
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                    required
                />
                <button type="submit">Submit Feedback</button>
            </div>
        </form>
    )
}

export default FeedbackForm
