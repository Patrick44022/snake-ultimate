
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { addTask, getTasks } from '../firebase/firestoreHelpers';
import { auth } from '../firebase/config';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [taskText, setTaskText] = useState('');
  const [tasks, setTasks] = useState([]);
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    if (selectedDate) {
      loadTasks(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    highlightTaskDates();
  }, [tasks]);

  const loadTasks = async (date) => {
    const userId = auth.currentUser?.uid || 'demo-user';
    const loaded = await getTasks(userId, date);
    setTasks(loaded);
  };

  const highlightTaskDates = async () => {
    const userId = auth.currentUser?.uid || 'demo-user';
    const dates = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const iso = date.toISOString().split('T')[0];
      const dayTasks = await getTasks(userId, iso);
      if (dayTasks.length > 0) {
        dates[iso] = { marked: true, dotColor: '#00adf5' };
      }
    }
    setMarkedDates(dates);
  };

  const handleAddTask = async () => {
    if (!taskText.trim() || !selectedDate) return;
    const userId = auth.currentUser?.uid || 'demo-user';
    await addTask(userId, selectedDate, taskText.trim());
    setTaskText('');
    loadTasks(selectedDate);
    highlightTaskDates();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📅 Familienkalender</Text>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          ...markedDates,
          [selectedDate]: { selected: true, selectedColor: '#00adf5' },
        }}
        theme={{
          selectedDayBackgroundColor: '#00adf5',
          todayTextColor: '#00adf5',
        }}
      />
      {selectedDate ? (
        <View style={styles.taskBox}>
          <Text style={styles.subtitle}>Termine & Aufgaben am {selectedDate}</Text>
          {tasks.length === 0 && <Text style={styles.noTasks}>Keine Einträge</Text>}
          {tasks.map((task, index) => (
            <Text
              key={index}
              style={{
                textDecorationLine: task.done ? 'line-through' : 'none',
                fontSize: 16,
                marginBottom: 4,
              }}>
              • {task.text}
            </Text>
          ))}
          <TextInput
            style={styles.input}
            placeholder="Neuer Termin oder Aufgabe"
            value={taskText}
            onChangeText={setTaskText}
          />
          <Button title="Hinzufügen" onPress={handleAddTask} />
        </View>
      ) : (
        <Text style={styles.info}>Bitte ein Datum auswählen</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f4f9fd' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  subtitle: { fontSize: 18, fontWeight: '600', marginVertical: 12 },
  noTasks: { fontStyle: 'italic', marginBottom: 8 },
  taskBox: { marginTop: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginTop: 8,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  info: { marginTop: 20, textAlign: 'center', fontStyle: 'italic' },
});
