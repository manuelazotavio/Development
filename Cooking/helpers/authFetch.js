import useUserLoggedStore from "../stores/useUserLoggedStore.js"
import AsyncStorage from '@react-native-async-storage/async-storage'

const authFetch = async (url, options) => {

    const token = useUserLoggedStore.getState().token
    
    allOptions = {
        ...options, 
        headers: {
            ...(options?.headers ? options.headers : {}),
            "Authorization": "Bearer " + token}}
    const response = await fetch(url, allOptions)

    const responseClone = response.clone()

    if(!response.ok || token === undefined){
        const data = await response.json()
        console.log(data)
        if(data?.error && data?.code && data.code === "expired-token" || data?.error && data?.code && data.code === "invalid-token" ){
            console.log('Token Expirado...')
            const resRefreshToken = await fetch('https://backcooking.onrender.com/auth/refresh-token', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                }
            })
            console.log('Rodou o refresh Token...')
            if(!resRefreshToken.ok){
                console.log('Erro ao realizar refresh Token...')
                useUserLoggedStore.setState({ 
                    id: null,
                    nome: '',
                    email: '',
                    avatar: '',
                    token: '',
                    isLogged: false}
                
                )
                try {
                    await AsyncStorage.removeItem('userLogged')

                } catch (error){
                    console.log(error)
                    alert('Erro ao limpar async storage!')
                }
                console.log('Erro ao realizar refresh Token...')
                return resRefreshToken
            }
            const dataRefreshToken = await resRefreshToken.json()
            console.log(dataRefreshToken)
            useUserLoggedStore.setState({token: dataRefreshToken.newToken})
            console.log('Token atualizado no zustand storage!')
            try {
                await AsyncStorage.setItem('userLogged', JSON.stringify({...dataRefreshToken.user, token: dataRefreshToken.newToken}))
                console.log('Token atualizado no async storage!')
            } catch (error){
                console.log(error)
                alert('Erro ao gravar dados de login no dispositivo!')
            }
            console.log('Rodando recursividade do authFetch!')
            return await authFetch(url, options)
        }
    }  
    return responseClone
}

export default authFetch
