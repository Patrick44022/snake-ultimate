
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Switch } from 'react-native';

export default function TasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [isAdmin, setIsAdmin] = useState(true); // Demo-Zweck

  const addTask = () => {
    if (taskText.trim()) {
      setTasks([...tasks, { text: taskText, done: false }]);
      setTaskText('');
    }
  };

  const toggleTask = index => {
    const newTasks = [...tasks];
    newTasks[index].done = !newTasks[index].done;
    setTasks(newTasks);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Aufgabenliste</Text>
      <View style={styles.adminSwitch}>
        <Text>Admin-Modus</Text>
        <Switch value={isAdmin} onValueChange={setIsAdmin} />
      </View>
      {isAdmin && (
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Neue Aufgabe"
            value={taskText}
            onChangeText={setTaskText}
          />
          <Button title="Hinzufügen" onPress={addTask} />
        </View>
      )}
      {tasks.map((task, index) => (
        <Text
          key={index}
          onPress={() => toggleTask(index)}
          style={{
            textDecorationLine: task.done ? 'line-through' : 'none',
            fontSize: 16,
            marginBottom: 4,
          }}>
          • {task.text}
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: { flex: 1, borderWidth: 1, padding: 8, marginRight: 8 },
  adminSwitch: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 },
});
