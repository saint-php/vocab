import { createContext, useContext, useState, useEffect } from 'react'

const ExamContext = createContext()

export function ExamProvider({ children }) {
  const [selectedExam, setSelectedExam] = useState(() => {
    return localStorage.getItem('selectedExam') || null
  })

  const selectExam = (exam) => {
    setSelectedExam(exam)
    localStorage.setItem('selectedExam', exam)
  }

  const clearExam = () => {
    setSelectedExam(null)
    localStorage.removeItem('selectedExam')
  }

  return (
    <ExamContext.Provider value={{ selectedExam, selectExam, clearExam }}>
      {children}
    </ExamContext.Provider>
  )
}

export function useExam() {
  return useContext(ExamContext)
}