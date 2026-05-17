import { useState, useCallback, useEffect } from 'react'

export const useFetch = (asyncFunction, immediate = true) => {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const execute = useCallback(async (...args) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await asyncFunction(...args)
      setData(response.data)
      return response
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [asyncFunction])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return { isLoading, data, error, execute }
}
