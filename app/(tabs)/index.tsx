import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';

// URL de la API (usar HTTPS si está disponible)
const API_URL = 'http://5.181.218.180:8000/predict';

// Configuración de Axios
const instance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

const App = () => {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [loading, setLoading] = useState(false);

  // Función para seleccionar imagen de la galería
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1, // Máxima calidad
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setPrediction(null);
        setConfidence(null);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  // Función para capturar una foto con la cámara
  const takePhoto = async () => {
    try {
      await ImagePicker.requestCameraPermissionsAsync();
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1, // Máxima calidad
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setPrediction(null);
        setConfidence(null);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  // Función para enviar imagen a la API y obtener predicción
  const predictImage = async () => {
    if (!image) {
      Alert.alert('Error', 'Por favor selecciona una imagen primero');
      return;
    }

    setLoading(true);
    setPrediction(null);
    setConfidence(null);

    try {
      // Convertir imagen a Base64
      const response = await fetch(image);
      const blob = await response.blob();
      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      // Enviar imagen a la API
      const apiResponse = await instance.post('/', { image: base64Image });

      setPrediction(apiResponse.data.prediction);
      setConfidence(apiResponse.data.confidence);
    } catch (error) {
      console.error('Error en la predicción:', error);
      Alert.alert('Error', error.response?.data?.error || 'Error al predecir la imagen');
    } finally {
      setLoading(false);
    }
  };

  // Función para traducir la predicción a español
  const translatePrediction = (pred) => {
    const translations = {
      freshripe: 'Fresco Maduro',
      freshunripe: 'Fresco Verde',
      overripe: 'Muy Maduro',
      ripe: 'Maduro',
      rotten: 'Podrido',
      unripe: 'Verde',
    };
    return translations[pred] || pred;
  };

  // Función para formatear la confianza
  const formatConfidence = (conf) => {
    return conf !== null && conf !== undefined ? `${(conf * 100).toFixed(0)}% de confianza` : '';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Madurez de Plátanos</Text>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : prediction ? (
        <View style={styles.predictionContainer}>
          <Text style={styles.predictionText}>
            Resultado: {translatePrediction(prediction)}
          </Text>
          <Text style={styles.confidenceText}>
            {formatConfidence(confidence)}
          </Text>
        </View>
      ) : null}

      {/* Botones en fila */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <FontAwesome name="image" size={20} color="white" />
          <Text style={styles.buttonText}>Galería</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <FontAwesome name="camera" size={20} color="white" />
          <Text style={styles.buttonText}>Cámara</Text>
        </TouchableOpacity>
      </View>

      {/* Botón para predecir */}
      {image && (
        <TouchableOpacity style={styles.predictButton} onPress={predictImage}>
          <FontAwesome name="search" size={20} color="white" />
          <Text style={styles.buttonText}>Predecir Madurez</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  image: {
    width: 340,
    height: 340,
    resizeMode: 'contain',
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#3498db',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    width: '45%',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  predictButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    width: '80%',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  predictionContainer: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#e8f5e9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2ecc71',
    alignItems: 'center',
  },
  predictionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
    textAlign: 'center',
    marginBottom: 5,
  },
  confidenceText: {
    fontSize: 16,
    color: '#2c3e50',
    textAlign: 'center',
  },
});

export default App;
