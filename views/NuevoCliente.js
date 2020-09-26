import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Platform } from 'react-native'
import { TextInput, Headline, Button, Paragraph, Dialog, Portal } from 'react-native-paper'
import axios from 'axios'

import globalStyles from '../styles/global'

const NuevoCliente = ({ navigation, route }) => {

    const { setConsultarAPI } = route.params

    // campos fomrulario
    const [nombre, setNombre] = useState('')
    const [telefono, setTelefono] = useState('')
    const [correo, setCorreo] = useState('')
    const [empresa, setEmpresa] = useState('')

    const [alerta, setAlerta] = useState(false)

    // detectar si estamos editando o creando nuevo cliente
    useEffect(() => {
        if (route.params.cliente) {
            console.log('ESTAMOS EDITANDO')
            // set values
            setNombre(route.params.cliente.nombre)
            setTelefono(route.params.cliente.telefono)
            setCorreo(route.params.cliente.correo)
            setEmpresa(route.params.cliente.empresa)
        } else {
            console.log('NUEVO CLIENTE')
        }
    }, [])

    // store customer in DB
    const saveCustomer = async () => {

        // validate
        if (nombre.trim() == '' || telefono.trim() == '' || correo.trim() == '' || empresa.trim() == '') {
            setAlerta(true)
            return
        }

        // generate curstomer
        const cliente = { nombre, telefono, correo, empresa }

        // store in the API
        const deviceURL = (Platform.OS === 'ios') ? 'http://localhost:3000/clientes' : 'http://10.0.2.2:3000/clientes'
        // detectar si estamos editando o creando nuevo cliente
        if (route.params.cliente) {

            const { id } = route.params.cliente
            cliente.id = id
            const url = deviceURL + '/' + id

            try {
                await axios.put(url, cliente)
            } catch (error) {
                console.warn(error)
            }
        }
        else {

            try {
                if (Platform.OS === 'ios') {
                    //para iOS
                    await axios.post(deviceURL, cliente)
                } else {
                    //para Android
                    await axios.post(deviceURL, cliente)
                }
            } catch (error) {
                console.warn(error)
            }
        }

        // redireccionar
        navigation.navigate('Inicio')

        // clean form
        setNombre('')
        setTelefono('')
        setCorreo('')
        setEmpresa('')

        setConsultarAPI(true)

    }

    return (
        <View style={globalStyles.contenedor}>
            <Headline style={globalStyles.titulo}>Add customer</Headline>
            <TextInput
                label='name'
                placeholder='Guille'
                onChangeText={(txt) => setNombre(txt)}
                value={nombre}
                style={styles.input}
            />
            <TextInput
                label='phone'
                placeholder='655556969'
                onChangeText={(txt) => setTelefono(txt)}
                value={telefono}
                style={styles.input}
            />
            <TextInput
                label='mail'
                placeholder='mail@mail.com'
                onChangeText={(txt) => setCorreo(txt)}
                value={correo}
                style={styles.input}
            />
            <TextInput
                label='company'
                placeholder='company name'
                onChangeText={(txt) => setEmpresa(txt)}
                value={empresa}
                style={styles.input}
            />
            <Button
                icon='pencil-circle'
                mode='contained'
                onPress={() => saveCustomer()}
            >
                SAVE CUSTOMER
            </Button>

            <Portal>
                <Dialog visible={alerta} onDismiss={() => setAlerta(false)}>
                    <Dialog.Title>ERROR</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>
                            All the fields are mandatory
                        </Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setAlerta(false)}>OK</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

        </View>
    )
}

export default NuevoCliente

const styles = StyleSheet.create({
    input: {
        marginBottom: 20,
        backgroundColor: 'transparent'
    }
})
