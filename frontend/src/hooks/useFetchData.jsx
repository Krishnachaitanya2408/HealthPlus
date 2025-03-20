import { useEffect, useState, useCallback } from 'react'
import { getToken } from '../utils/auth'

const useFetchData = (url) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            })

            if (!res.ok) {
                throw new Error(`Failed to fetch: ${res.status}`)
            }

            const result = await res.json()
            setData(result.data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [url])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return {
        data,
        loading,
        error,
        refetch: fetchData
    }
}

export default useFetchData
