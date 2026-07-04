import { useEffect } from 'react'
import AOS from 'aos'

export const useAOS = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      offset: 50,
    })
  }, [])
}