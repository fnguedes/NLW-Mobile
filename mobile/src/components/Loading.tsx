import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'

export function Loading() {
  return (
    <ActivityIndicator className='flex-1 bg-green-500 items-center justify-center text-orange-500'/>
  )
}