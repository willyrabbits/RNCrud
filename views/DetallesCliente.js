import React from 'react'
import { View, StyleSheet, Alert, Platform } from 'react-native'
import { Headline, Text, Subheading, Button, FAB } from 'react-native-paper'
import globalStyles from '../styles/global'
import axios from 'axios'

const DetallesCliente = ({ navigation, route }) => {

    const { nombre, telefono, correo, empresa, id } = route.params.item
    const { setConsultarAPI } = route.params

    const showConfirmation = () => {
        Alert.alert(
            'Would you like to erease this customer?',
            'This action can not be undone',
            [
                { text: 'Yep, delete', onPress: () => deleteCustomer() },
                { text: 'Cancel', style: 'cancel' }
            ]
        )
    }

    const deleteCustomer = async () => {
        const url = (Platform.OS === 'ios') ? `http://localhost:3000/clientes/${id}` : `http://10.0.2.2:3000/clientes/${id}`
        console.log(url)
        try {
            await axios.delete(url)
        } catch (error) {
            console.warn(error)
        }

        //redireccionar
        navigation.navigate('Inicio')

        //consultar API de nuevo
        setConsultarAPI(true)
    }

    return (
        <View style={globalStyles.contenedor}>
            <Headline style={globalStyles.titulo}>{nombre}</Headline>
            <Text style={styles.texto}>Company: <Subheading>{empresa}</Subheading></Text>
            <Text style={styles.texto}>Phone number: <Subheading>{telefono}</Subheading></Text>
            <Text style={styles.texto}>EMail: <Subheading>{correo}</Subheading></Text>
            <Button
                icon='cancel'
                mode='contained'
                style={styles.btnEliminar}
                onPress={() => showConfirmation()}
            >
                Delete customer
            </Button>
            <FAB
                icon="pencil"
                style={globalStyles.fab}
                onPress={() => navigation.navigate('NuevoCliente', { setConsultarAPI, cliente: route.params.item })}
            />
        </View>
    )
}

export default DetallesCliente

const styles = StyleSheet.create({
    texto: {
        marginBottom: 20,
        fontSize: 18
    },
    btnEliminar: {
        marginTop: 100,
        backgroundColor: 'red'
    }

})