import { StyleSheet, View, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

export default function AboutScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText type="title" style={styles.title}>Madurez Platano App</ThemedText>
      
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>¿Qué hace esta aplicación?</ThemedText>
        <ThemedText style={styles.text}>
          Clasifica el estado de madurez de plátanos usando inteligencia artificial:
        </ThemedText>
        <ThemedText style={styles.listItem}>• Fresco Maduro</ThemedText>
        <ThemedText style={styles.listItem}>• Fresco Verde</ThemedText>
        <ThemedText style={styles.listItem}>• Muy Maduro</ThemedText>
        <ThemedText style={styles.listItem}>• Maduro</ThemedText>
        <ThemedText style={styles.listItem}>• Podrido</ThemedText>
        <ThemedText style={styles.listItem}>• Verde</ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Tecnología</ThemedText>
        <ThemedText style={styles.text}>
          Modelo ResNet18 entrenado con PyTorch y servido con FastAPI.
        </ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Desarrolladores</ThemedText>
        <ThemedText style={styles.listItem}>• Rodrigo García,PhD</ThemedText>
        <ThemedText style={styles.listItem}>• Samir Castaño, Msg</ThemedText>
        <ThemedText style={styles.listItem}>• Mario Macea, Msg</ThemedText>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#ffffff', // Fondo blanco
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000000', // Texto negro
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000000', // Texto negro
  },
  text: {
    fontSize: 16,
    color: '#000000', // Texto negro
    marginBottom: 10,
    lineHeight: 24,
  },
  listItem: {
    fontSize: 16,
    color: '#000000', // Texto negro
    marginLeft: 15,
    marginVertical: 3,
    lineHeight: 24,
  },
});