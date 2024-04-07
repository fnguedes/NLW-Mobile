import { View, Text, Image, StatusBar, Alert } from 'react-native'
import React, { useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Link, Redirect } from 'expo-router'

import { api } from '@/server/api'
import { useBadgeStore } from '@/store/badge-store'
import { colors } from '@/styles/colors'

import { Input } from '@/components/Input'
import { Button } from '@/components/Button'

export default function Home() {

  const [codigo,setCodigo]=useState('')
  const [isLoading,setIsLoading]= useState(false)

  const badgeStore = useBadgeStore()

  async function handleAccessCredential(){
    try {
      if(!codigo.trim()){
        return Alert.alert("Credencial","Informe o código do ingresso")
      }

      setIsLoading(true)

      const {data} = await api.get(`/attendees/${codigo}/badge`)
      badgeStore.save(data.badge)
    }catch(error){
      console.log(error)



      setIsLoading(false)
      Alert.alert("Ingresso","Ingresso não encontrado")
    }
  }

  if(badgeStore.data?.checkInURL){
    return <Redirect href={"/ticket"}/>
  }
  return (
    <View className="bg-green-500 flex-1 justify-center items-center p-8">

      <StatusBar barStyle='light-content'/>

      <Image 
      source={require('@/assets/logo.png')}
      className='h-16' 
      resizeMode='contain'/>

      <View className='w-full mt-12 gap-3'>
        <Input>
          <MaterialCommunityIcons name='ticket-confirmation-outline' size={20} color={colors.green[200]}/>
          <Input.Field placeholder='Código do ingresso' onChangeText={setCodigo}/>
        </Input>

        <Button title="Acesssa Credencial" onPress={handleAccessCredential} isLoading={isLoading}/>

        <Link 
        className='text-gray-100 text-base font-bold text-center mt-8'
        href={"/register"}>
          Ainda não possui ingresso?
          </Link>
      </View>
    </View>
  )
}