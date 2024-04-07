import { View, Text, StatusBar, ScrollView, TouchableOpacity, Alert, Modal, Share } from 'react-native'
import React, { useState } from 'react'
import { FontAwesome } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { MotiView } from 'moti'

import { colors } from '@/styles/colors'

import { useBadgeStore } from '@/store/badge-store'

import { Credential } from '@/components/Credential'
import { Button } from '@/components/Button'
import { Header } from '@/components/Header'
import { QRCode } from '@/components/Qrcode'
import { Redirect } from 'expo-router'

export default function ticket() {

  const [ expandQRCode, setexpandQRCode]= useState(false)

  const badgeStore = useBadgeStore()

  async function  handleSelectImage(){
    try{
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing:true,
        aspect: [4,4]
      })

      if(result.assets){
        badgeStore.updateAvatar(result.assets[0].uri)
      }

    }catch(error){
      console.log(error)
      Alert.alert("Foto","Não foi possível selecionar a imagem")
    }
  }

  if(!badgeStore.data?.checkInURL){
    return <Redirect href={'/'}/>
  }

  async function handleShare(){
    try{
      if(badgeStore.data?.checkInURL){
        await Share.share({
          message: badgeStore.data.checkInURL
        })
      }
    }catch(error){
      console.log('erros')
      Alert.alert('Compartilhar','Não foi possível compartilhar')
    }
  }

  return (
    <View className='flex-1 bg-green-500'>
      <StatusBar barStyle='light-content'/>
      <Header title="Minha Credencial"/>

      <ScrollView 
        className='-mt-28 -z-10'
        contentContainerClassName='px-8 pb-8'
        showsVerticalScrollIndicator={false}
        >

        <Credential 
          data={badgeStore.data}
          onChangeAvatar={handleSelectImage} 
          onShowQRCode={()=>setexpandQRCode(true)}/>

        <MotiView
          from={{
            translateY:0
          }}
          animate={{
            translateY:10
          }}
          transition={{
            loop:true,
            type:'timing',
            duration:700
          }}
        >
          <FontAwesome 
            name='angle-double-down' 
            size={25} 
            color={colors.gray[300]}
            className='self-center my-6'
            />
        </MotiView>
        <Text className='text-white font-bold text-2xl mt-4'>
          Compartilhar credencial
        </Text>

        <Text className='text-white font-regular text-base mt-1 mb-6'>
          Mostre ao mundo que você vai participar do {badgeStore.data.eventTitle}
        </Text>

        <Button title='Compartilhar' onPress={handleShare}/>

        <View className='mt-10'>
          <TouchableOpacity  
            activeOpacity={0.7}
            onPress={()=> badgeStore.remove()}
          >
            <Text className='text-base text-white font-bold text-center'>
              Remover Ingresso
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      <Modal visible={expandQRCode} statusBarTranslucent>
        <View className='flex-1 bg-green-500 items-center justify-center'>
          <QRCode value='teste' size={300}/>
          <TouchableOpacity 
          activeOpacity={0.7}
          onPress={ ()=> setexpandQRCode(false)}
          >
            <Text className='font-body text-orange-500 text-sm mt-10'>
              Fechar QRCOde
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}