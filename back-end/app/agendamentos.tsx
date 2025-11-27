import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';

export default function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [novoAgendamento, setNovoAgendamento] = useState('');
  const params = useLocalSearchParams();
  const unidadeId = params.unidadeId;

  const carregar = () => {
    axios.get(`http://192.168.15.185:3000/api/agendamentos?unidadeId=${unidadeId}`)
      .then(res => setAgendamentos(res.data))
      .catch(() => Alert.alert('Erro ao buscar agendamentos'));
  };

  useEffect(() => {
    carregar();
  }, []);

  const salvarAgendamento = () => {
    if (!novoAgendamento) return;

    axios.post('http://192.168.15.185:3000/api/agendamentos', {
      unidadeId,
      data: novoAgendamento
    }).then(() => {
      Alert.alert('Agendado com sucesso!');
      setNovoAgendamento('');
      carregar();
    }).catch(() => {
      Alert.alert('Erro ao agendar');
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Agendamentos</Text>

      <FlatList
        data={agendamentos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.item}>📅 {item.data}</Text>}
      />

      <TextInput
        placeholder="Ex: 2025-07-01 14:00"
        value={novoAgendamento}
        onChangeText={setNovoAgendamento}
        style={styles.input}
      />
      <Button title="Agendar" onPress={salvarAgendamento} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f8ff' },
  titulo: { fontSize: 24, fontFamily: 'Poppins_700Bold', marginBottom: 16 },
  item: { fontSize: 16, fontFamily: 'Poppins_400Regular', marginVertical: 4 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, marginTop: 12, marginBottom: 8,
    fontFamily: 'Poppins_400Regular'
  },
});
