import { View, Image, StatusBar, Alert } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Link, Redirect } from "expo-router"

import { api } from "@/server/api"
import { useBadgeStore } from "@/store/badge-store"

import { Input } from "@/components/input"
import { colors } from "@/styles/colors"
import { Button } from "@/components/button"
import { useState } from "react"

export default function Home() {
    const [code, setCode] = useState("")
    const [isLoading, setIsLoaging] = useState(false)

    const badgeStore = useBadgeStore()

    async function handleAcessCredential() {
        try {
        if(!code.trim()){
            return Alert.alert("Ingresso", "Informe o código do ingresso!")
        }

        setIsLoaging(true)

       const { data } = await api.get(`/attendees/${code}/badge`)
       badgeStore.save(data.badge)

    } catch (error){
        console.log(error)
        setIsLoaging(false)

        Alert.alert("Ingresso", "Ingresso não encontrado!")
    }
    }

    if(badgeStore.data?.checkInURL){
        return <Redirect href="/ticket" />
    }

    return (
        <View className="flex-1 bg-green-500 items-center justify-center p-8">
            <StatusBar barStyle="light-content"/>
            <Image source={require("@/assets/logo.png")} 
            className="h-16 " 
            resizeMode="contain" 
            />
            <View className="w-full mt-12 gap-3">
                <Input>
                <MaterialCommunityIcons 
                name="ticket-confirmation-outline" 
                size={20} 
                color={colors.green[200]}
                />
                
                <Input.Field 
                placeholder="Código do ingresso"
                onChangeText={setCode}
                />

                </Input>
                <Button 
                title="Acessar credencial" 
                onPress={handleAcessCredential}
                isLoading={isLoading}
                />
                <Link href="/register" className="text-gray-100 text-base font-bold text-center mt-8">Ainda não possui ingresso?</Link>
            </View>
        </View>
    )
}