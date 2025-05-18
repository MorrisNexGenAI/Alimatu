import { useState, useEffect } from 'react';
import axios from '../lib/axios';
import type {Student} from '../types/student'


const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);

  const fetchStudents = async () => {
    const res = await axios.get('/students');
    setStudents(res.data);
  };

  const createStudent = async (student: Omit<Student, 'id'>) => {
    const res = await axios.post('/students', student);
    setStudents([...students, res.data]);
  };

  const updateStudent = async (id: number, student: Partial<Student>) => {
    const res = await axios.put(`/students/${id}`, student);
    setStudents(students.map(s => (s.id === id ? res.data : s)));
  };

  const deleteStudent = async (id: number) => {
    await axios.delete(`/students/${id}`);
    setStudents(students.filter(s => s.id !== id));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return { students, createStudent, updateStudent, deleteStudent };
};

export default useStudents;
