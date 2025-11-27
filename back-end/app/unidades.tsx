import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function UnidadesScreen() {
  const [unidades, setUnidades] = useState([]);
  const router = useRouter();

  useEffect(() => {
    axios.get('http://192.168.15.185:3000/api/unidades')
      .then(res => setUnidades(res.data))
      .catch(err => {
        console.error(err);
        Alert.alert('Erro ao carregar unidades');
      });
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({ pathname: '/agendamentos', params: { unidadeId: item.id } })}
    >
      <Text style={styles.unidade}>{item.nome}</Text>
      <Text style={styles.subtitulo}>Médicos:</Text>
      {item.medicos.map((medico, index) => (
        <Text key={index} style={styles.medico}>• {medico}</Text>
      ))}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Unidades de Saúde</Text>
      <FlatList
        data={unidades}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
}

const styles = StyleSheet.cr
