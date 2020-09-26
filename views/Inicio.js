import React, { useState, useEffect } from 'react'
import { View, FlatList, Platform } from 'react-native'
import axios from 'axios'
import { List, Headline, Button, FAB } from 'react-native-paper'
import globalStyles from '../styles/global'

const Inicio = ({ navigation }) => {

    const [clientes, setClientes] = useState([])
    const [consultarAPI, setConsultarAPI] = useState(true)

    useEffect(() => {
        const getCustomersApi = async () => {
            try {
                const deviceURL = (Platform.OS === 'ios') ? 'http://localhost:3000/clientes' : 'http://10.0.2.2:3000/clientes'
                const resultado = await axios.get(deviceURL)
                setClientes(resultado.data)
                setConsultarAPI(false)
            } catch (error) {
                console.warn(error)
            }
        }
        if (consultarAPI) {
            getCustomersApi()
        }
    }, [consultarAPI])

    return (
        <View style={globalStyles.contenedor}>
            <Button icon="plus-circle" onPress={() => navigation.navigate('NuevoCliente', { setConsultarAPI })}>
                New Customer
            </Button>
            <Headline style={globalStyles.titulo}>{clientes.length > 0 ? 'Customers' : 'No customers yet'}</Headline>
            <FlatList
                data={clientes}
                keyExtractor={cliente => (cliente.id).toString()}
                renderItem={({ item }) => (
                    <List.Item
                        title={item.nombre}
                        description={item.empresa}
                        onPress={() => navigation.navigate('DetallesCliente', { item, setConsultarAPI })}
                    />
                )}
            />

            <FAB
                icon="plus"
                style={globalStyles.fab}
                onPress={() => navigation.navigate('NuevoCliente', { setConsultarAPI })}
            />
        </View>
    )
}

export default Inicio
