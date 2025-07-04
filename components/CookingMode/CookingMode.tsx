import { useRouter } from "expo-router"
import React, { useEffect, useRef, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, Animated } from "react-native"
import Header from "./Header/Header"
import Navigation from "./Navigation/Navigation"
import ProgressBar from "./ProgressBar/ProgressBar"
import Timer from "./Timer/Timer"
import { Recipe } from "@/Types/RecipeType"
import { CheckCircle, Circle, Clock } from "lucide-react-native"

interface CookingModeProps {
  recipes: Recipe
}

const CookingMode: React.FC<CookingModeProps> = ({ recipes }) => {
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(
    new Array(recipes?.instructions.length).fill(false)
  )
  const [activeStep, setActiveStep] = useState<number | null>(null)
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null)
  const [showTimer, setShowTimer] = useState(false)
  const timerInterval = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current)
      }
    }
  }, [])

  useEffect(() => {
    // Animation d'entrée pour les éléments de la liste
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start()
  }, [])

  const startTimer = (minutes: number, stepIndex: number) => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current)
    }
    setTimerSeconds(minutes * 60)
    setShowTimer(true)
    setActiveStep(stepIndex)

    timerInterval.current = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev === null || prev <= 0) {
          if (timerInterval.current) {
            clearInterval(timerInterval.current)
          }
          setShowTimer(false)
          setActiveStep(null)
          return null
        }
        return prev - 1
      })
    }, 1000)
  }

  const cancelTimer = () => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current)
    }
    setTimerSeconds(null)
    setShowTimer(false)
    setActiveStep(null)
  }

  const toggleStepCompletion = (index: number) => {
    const newCompletedSteps = [...completedSteps]
    newCompletedSteps[index] = !newCompletedSteps[index]
    setCompletedSteps(newCompletedSteps)

    if (newCompletedSteps[index] && activeStep === index && showTimer) {
      cancelTimer()
    }
  }

  const handleFinish = () => {
    if (completedSteps.every(step => step)) {
      router.push(`/recipe/${recipes?.id}/congratulations`)
    }
  }

  const handleBack = () => {
    router.back()
  }
  
  const calculateProgress = () => {
    const completedCount = completedSteps.filter(step => step).length
    return (completedCount / recipes?.instructions.length) * 100
  }
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  return (
    <View className="flex-1 bg-neutral-white">
      <View className="p-4">
        <Header title={recipes?.title} />
        <ProgressBar
          completedSteps={completedSteps}
          totalSteps={recipes?.instructions.length}
        />
      </View>

      <ScrollView className="flex-1 px-4">
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text className="text-xl font-bold mb-4 text-text-primary">
            Instructions de préparation
          </Text>
          
          {recipes?.instructions.map((instruction, index) => (
            <TouchableOpacity 
              key={index}
              onPress={() => toggleStepCompletion(index)}
              className={`mb-4 p-4 rounded-xl flex-row ${completedSteps[index] ? 'bg-primary/10' : 'bg-neutral-light'} ${activeStep === index ? 'border-2 border-primary' : ''}`}
              activeOpacity={0.8}
            >
              <View className="mr-3 mt-1">
                {completedSteps[index] ? (
                  <CheckCircle size={24} color="#FF8050" fill="#FF8050" fillOpacity={0.2} />
                ) : (
                  <Circle size={24} color="#6B7280" />
                )}
              </View>
              <View className="flex-1">
                <View className="flex-row justify-between items-start mb-2">
                  <Text className={`text-lg font-semibold ${completedSteps[index] ? 'text-primary' : 'text-text-primary'}`}>
                    Étape {index + 1}
                  </Text>
                  {activeStep === index && showTimer && timerSeconds !== null && (
                    <View className="flex-row items-center bg-primary/20 px-3 py-1 rounded-full">
                      <Clock size={16} color="#FF8050" className="mr-1" />
                      <Text className="text-primary font-medium">{formatTime(timerSeconds)}</Text>
                    </View>
                  )}
                </View>
                <Text className={`text-base leading-6 ${completedSteps[index] ? 'text-text-secondary line-through' : 'text-text-primary'}`}>
                  {instruction}
                </Text>
                
                {!showTimer && !completedSteps[index] && (
                  <View className="flex-row mt-3">
                    {[1, 3, 5, 10].map((min) => (
                      <TouchableOpacity 
                        key={min}
                        onPress={() => startTimer(min, index)}
                        className="bg-primary-light/30 px-3 py-1 rounded-full mr-2"
                      >
                        <Text className="text-primary">{min} min</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </ScrollView>

      <View className="p-4 border-t border-neutral-light">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity 
            onPress={handleBack}
            className="px-5 py-3 rounded-full bg-neutral-light"
          >
            <Text className="text-text-primary font-medium">Retour</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={handleFinish}
            className={`px-5 py-3 rounded-full ${completedSteps.every(step => step) ? 'bg-primary' : 'bg-primary/30'}`}
            disabled={!completedSteps.every(step => step)}
          >
            <Text className="text-white font-medium">Terminer</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showTimer && timerSeconds !== null && (
        <Timer seconds={timerSeconds} onCancel={cancelTimer} />
      )}
    </View>
  )
}

export default CookingMode
