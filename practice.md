This is my academic flow: apis:
import axios from 'axios';
import { BASE_URL } from './config';
import type { AcademicYear, PaginatedResponse } from '../types';

export const getAcademicYears = async (): Promise<AcademicYear[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/academic_years/`);
    console.log('Raw Academic Years API Response:', JSON.stringify(response.data, null, 2));
    const data = response.data as PaginatedResponse<AcademicYear>;
    if (!Array.isArray(data.results)) {
      throw new Error(`Expected array in results, got ${typeof data.results}`);
    }
    return data.results;
  } catch (error: any) {
    console.error('Fetch Academic Years Error:', JSON.stringify({
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    }, null, 2));
    throw error;
  }
};

import axios from 'axios';
import { BASE_URL } from './config';
import type { AcademicYear, PaginatedResponse } from '../types';

export const getAcademicYears = async (): Promise<AcademicYear[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/academic_years/`);
    console.log('Raw Academic Years API Response:', JSON.stringify(response.data, null, 2));
    const data = response.data as PaginatedResponse<AcademicYear>;
    if (!Array.isArray(data.results)) {
      throw new Error(`Expected array in results, got ${typeof data.results}`);
    }
    return data.results;
  } catch (error: any) {
    console.error('Fetch Academic Years Error:', JSON.stringify({
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    }, null, 2));
    throw error;
  }
};

hooks:no hook yet.
no form yet.

levels flow:
apis:
// api/levels.ts
import axios from 'axios';
import { BASE_URL } from './config';
import type { Level, PaginatedResponse } from '../types';

export const getLevels = async (): Promise<Level[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/levels/`);
    console.log('Raw Levels API Response:', JSON.stringify(response.data, null, 2));
    const data = response.data as PaginatedResponse<Level>;
    if (!Array.isArray(data.results)) {
      throw new Error(`Expected array in results, got ${typeof data.results}`);
    }
    return data.results;
  } catch (error: any) {
    console.error('Fetch Levels Error:', JSON.stringify({
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    }, null, 2));
    throw error;
  }
};

export const createLevel = async (data: {level: number }): Promise<Level> => {
  try {
    const response = await axios.post(`${BASE_URL}/api/levels/`, data, {
      headers: { 'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '' },
    });
    console.log('Create Level Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error: any) {
    console.error('Create Level Error:', JSON.stringify({
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    }, null, 2));
    throw error;
  }
};

export const deleteLevel = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/api/levels/${id}/`, {
      headers: { 'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '' },
    });
    console.log(`Deleted Level ID: ${id}`);
  } catch (error: any) {
    console.error('Delete Level Error:', JSON.stringify({
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    }, null, 2));
    throw error;
  }
};

hooks:
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../api';
import type { Level } from '../types';

export const useLevels = () => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLevels = async () => {
      setLoading(true);
      setError(null);
      try {
        const levelData = await api.levels.getLevels();
        console.log('Raw Levels Response:', JSON.stringify(levelData, null, 2));
        setLevels(levelData);
        console.log('Processed Levels:', JSON.stringify(levelData, null, 2));
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to load levels';
        setError(errorMessage);
        console.error('Fetch Levels Error:', JSON.stringify({
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        }, null, 2));
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchLevels();
  }, []);

  return { levels, loading, error };
};

form:
import React from 'react';
import { useLevels } from '../../../hooks/useLevels';
import { AdminForm } from '../../../components/admin/AdminForm';
import { AdminList } from '../../../components/admin/AdminList';
import { bomiStyles } from '../../../templates/Bomi junior High/bomi';

export const LevelPage = () => {
  const { levels,  loading } = useLevels();

  return (
    <div className="container space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: bomiStyles.textColor }}>
        Manage Levels
      </h1>
     
      <div className="card">
        <AdminList
          columns={['Level Name']}
          data={levels.map((l) => [l.name])}
          loading={loading}
        />
      </div>
    </div>
  );
};

Subjects:
apis:
import axios, { AxiosResponse } from 'axios';
import { BASE_URL } from './config';
import type { Subject, PaginatedResponse } from '../types';

export const getSubjects = async (levelId?: number): Promise<Subject[]> => {
    try {
      const response: AxiosResponse<PaginatedResponse<Subject> | Subject[]> = await axios.get(`${BASE_URL}/api/subjects/`, {
        params: levelId ? { level_id: levelId } : {},
      });
      console.log('Raw Subjects API Response:', JSON.stringify(response.data, null, 2));
      let data: Subject[];
      if (Array.isArray(response.data)) {
        data = response.data;
      } else if (response.data && typeof response.data === 'object' && Array.isArray(response.data.results)) {
        data = response.data.results;
      } else {
        console.error('Invalid subjects response format:', JSON.stringify(response.data, null, 2));
        return [];
      }
      return data;
    } catch (error: any) {
      console.error('Fetch Subjects Error:', JSON.stringify({
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      }, null, 2));
      return [];
    }
  };

export const getSubjectsByLevel = async (levelId: number): Promise<Subject[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/subjects/`, {
      params: { level_id: levelId },
    });
    console.log('Raw Subjects by Level API Response:', JSON.stringify(response.data, null, 2));
    const data = response.data as PaginatedResponse<Subject>;
    if (!Array.isArray(data.results)) {
      throw new Error(`Expected array in results, got ${typeof data.results}`);
    }
    return data.results;
  } catch (error: any) {
    console.error('Fetch Subjects by Level Error:', JSON.stringify({
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    }, null, 2));
    throw error;
  }
};

export const createSubject = async (data: { subject: string; level: number }): Promise<Subject> => {
  try {
    const response = await axios.post(`${BASE_URL}/api/subjects/`, data, {
      headers: { 'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '' },
    });
    console.log('Create Subject Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error: any) {
    console.error('Create Subject Error:', JSON.stringify({
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    }, null, 2));
    throw error;
  }
};

export const deleteSubject = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/api/subjects/${id}/`, {
      headers: { 'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '' },
    });
    console.log(`Deleted Subject ID: ${id}`);
  } catch (error: any) {
    console.error('Delete Subject Error:', JSON.stringify({
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    }, null, 2));
    throw error;
  }
};

hooks:
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../api';
import type { Level, Subject } from '../types';

export const useSubjects = () =>{
  const [levels, setLevels] = useState<Level[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLevelId, setSelectedLevelId] = useState<number |null>(null);

useEffect(()=>{
  const fetchLevelData = async()=>{
    setLoading(true);
    try{
      const levelResults = await api.levels.getLevels();
     
      let levelData:Level[]=[];
      if(Array.isArray(levelResults)){
        setLevels(levelResults)
      } else if (levelResults && typeof levelResults === 'object' && Array.isArray(levelResults.results)) {
        levelData=levelResults.results
      } else {
        console.warn('Unexpectedd level respond:',JSON.stringify(levelResults,null,2));
        throw new Error('Invalid level response')
      }
    } catch (err:any) {
      console.error('Error loading level data:', JSON.stringify({
        message:err.message,
        response:err.response?.data,
        status:err.response?.status,
      },null,2));
      toast.error('failed to fetch level data');
      setLevels([])
    } finally {
      setLoading(false)
    }
  }
  fetchLevelData()
},[])

useEffect(()=>{
  if(!selectedLevelId){
    toast.error('Please select level')
    return;
  }
  const fetchSubjects = async () =>{
    try{
      const subjectRespone = await api.subjects.getSubjectsByLevel(selectedLevelId);
      let subjectData:Subject[]=[];
      if(Array.isArray(subjectRespone)){
        setSubjects(subjectRespone);
  
      } else if (subjectRespone && typeof subjectRespone === 'object' && Array.isArray(subjectRespone.results)){
        subjectData=subjectRespone.results
      } else {
        console.warn('Unexpected subject Response:',JSON.stringify(subjectRespone,null,2))
        throw new Error('Invalid subject response format');
      }
    } catch (err:any){
      console.error('Failed to load subjects data:', JSON.stringify({
        message:err.message,
        response:err.response?.data,
        status:err.response?.status,
      }, null,2))
      toast.error('Failed to fetch subjects')
      setSubjects([])
    }finally {
      setLoading(false)
    }
   
  } 
  fetchSubjects()
},[])

  
const createSubject = async (data:{
  subject:string;
  level:number;
  level_id:number
})=>{
  if (!selectedLevelId) {
    toast.error('Please select level')
    return;
  }
  setLoading(true);
  try {
    const newSubject = await api.subjects.createSubject(data)
    const updatedSubject = await api.subjects.getSubjectsByLevel(selectedLevelId);
    setSubjects(updatedSubject);
    toast.success('Subject created successfully');
  } catch (err:any){
    console.error('Error creating subject',err)
    toast.error(err.response?.data?.err);
  }finally{
    setLoading(false)
  }
}

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const levelId = parseInt(e.target.value) || null;
    setSelectedLevelId(levelId);
    console.log('Selected Level ID:', levelId);
  };
  return {
    subjects,
    levels,
    selectedLevelId,
    loading,
    handleLevelChange,
    createSubject,
   
   
  };

}

forms:
import React from 'react';
import { useSubjects } from '../../../hooks/useSubjects';
import { AdminForm } from '../../../components/admin/AdminForm';
import { AdminList } from '../../../components/admin/AdminList';

export const SubjectPage = () => {
  const {
    subjects,
    levels,
    selectedLevelId,
    handleLevelChange,
    createSubject,
    loading,
  } = useSubjects();

  return (
    <div className="container space-y-6">
      <h1 className="text-2xl font-bold">Manage Subjects</h1>

      {/* Level Selector */}
      <div className="card">
        <label className="block mb-2 text-sm font-medium">Select Level:</label>
        <select
          value={selectedLevelId || ''}
          onChange={handleLevelChange}
          className="border p-2 rounded w-full"
        >
          <option value="">-- Choose Level --</option>
          {levels.map((level) => (
            <option key={level.id} value={level.id}>
              {level.name}
            </option>
          ))}
        </select>
      </div>

      {/* Form to Add Subject */}
      <div className="card">
        <AdminForm
          fields={[
            { name: 'subject', label: 'Subject Name', type: 'text' },
          ]}
          onSubmit={(values) =>
            createSubject({
              subject: values.subject,
              level_id: selectedLevelId!,
              level: selectedLevelId!, // Adjust based on your API requirements
            })
          }
          disabled={!selectedLevelId}
          loading={loading}
        />
      </div>

      {/* List of Subjects */}
      <div className="card">
        <AdminList
          columns={['Subject']}
          data={subjects.map((s) => [s.subject])}
          loading={loading}
        />
      </div>
    </div>
  );
};

periods:
apis:
import axios, { AxiosResponse } from 'axios';
import { BASE_URL } from './config';
import type { PaginatedResponse, Period } from '../types';


export const getPeriods = async (): Promise<Period[]> => {
    try {
      const response: AxiosResponse<PaginatedResponse<Period> | Period[]> = await axios.get(`${BASE_URL}/api/periods/`)
      console.log('Raw Subjects API Response:', JSON.stringify(response.data, null, 2));
      let data: Period[];
      if (Array.isArray(response.data)) {
        data = response.data;
      } else if (response.data && typeof response.data === 'object' && Array.isArray(response.data.results)) {
        data = response.data.results;
      } else {
        console.error('Invalid Periods response format:', JSON.stringify(response.data, null, 2));
        return [];
      }
      return data;
    } catch (error: any) {
      console.error('Fetch Periods Error:', JSON.stringify({
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      }, null, 2));
      return [];
    }
  };




export const createPeriods = async (data: { level: number; academicYear: string }): Promise<Period> => {
  try {
    const response = await axios.post(`${BASE_URL}/api/periods/`, data, {
      headers: { 'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '' },
    });
    console.log('Create Periods Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error: any) {
    console.error('Create Period Error:', JSON.stringify({
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    }, null, 2));
    throw error;
  }
};

export const deletePeriods = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/api/periods/${id}/`, {
      headers: { 'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '' },
    });
    console.log(`Deleted Period ID: ${id}`);
  } catch (error: any) {
    console.error('Delete Period Error:', JSON.stringify({
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    }, null, 2));
    throw error;
  }
};

hooks:
import { useState, useCallback } from 'react';
import { api } from '../api';
import type { Period } from '../types';

export const usePeriods = () => {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPeriods = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.periods.getPeriods();
      setPeriods(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load periods';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { periods, loadPeriods, loading, error };
};

no form yet. 


my Admin page:
import React, { useState } from 'react';
import { SubjectPage } from './forms/Subject';
import { LevelPage } from './forms/Level';

import  BomiTheme from '../../templates/Bomi junior High/bomi';



const sections = [
  { name: 'Subjects', component: <SubjectPage /> },
  { name: 'Levels', component: <LevelPage /> },

];

export const AdminPage: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (sectionName: string) => {
    setOpenSection(openSection === sectionName ? null : sectionName);
  };

  return (
    <BomiTheme>
      <div className="container">
        <div className="bomi-header">
          <div className="bomi-logo">
            <img src="/logo.png" alt="Bomi Junior High Logo" />
          </div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.name} className="card">
              <div
                className="flex justify-between items-center p-4 cursor-pointer"
                onClick={() => toggleSection(section.name)}
              >
                <h2 className="text-xl font-semibold">{section.name}</h2>
                <span>{openSection === section.name ? '−' : '+'}</span>
              </div>
              {openSection === section.name && (
                <div className="p-4">{section.component}</div>
              )}
            </div>
          ))}
        </div>
        <div className="bomi-footer">
          <p>&copy; 2025 Bomi Junior High. All rights reserved.</p>
        </div>
      </div>
    </BomiTheme>
  );
};

AdminList:
import React from 'react';
import { bomiStyles } from '../../templates/Bomi junior High/bomi';

interface AdminListProps {
  columns: string[];
  data: string[][];
  loading?: boolean;
}

export const AdminList: React.FC<AdminListProps> = ({ columns, data, loading = false }) => {
  return (
    <div className="overflow-x-auto">
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="border p-2 text-left"
                  style={{ backgroundColor: bomiStyles.backgroundColor }}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="border p-2 text-center">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border p-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

AdminForm:
import React, { useState } from 'react';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  options?: { value: string; label: string }[];
}

interface AdminFormProps {
  fields: FormField[];
  onSubmit: (values: Record<string, string>) => void;
  disabled?: boolean;
  loading?: boolean;
}

export const AdminForm: React.FC<AdminFormProps> = ({
  fields,
  onSubmit,
  disabled = false,
  loading = false,
}) => {
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disabled && !loading) {
      onSubmit(formValues);
      setFormValues({}); // Reset form after submission
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col">
          <label className="mb-1 text-sm font-medium">{field.label}</label>
          {field.type === 'textarea' ? (
            <textarea
              name={field.name}
              value={formValues[field.name] || ''}
              onChange={handleChange}
              className="border p-2 rounded"
              disabled={disabled || loading}
            />
          ) : field.type === 'select' ? (
            <select
              name={field.name}
              value={formValues[field.name] || ''}
              onChange={handleChange}
              className="border p-2 rounded"
              disabled={disabled || loading}
            >
              <option value="">Select {field.label}</option>
              {field.options?.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              name={field.name}
              value={formValues[field.name] || ''}
              onChange={handleChange}
              className="border p-2 rounded"
              disabled={disabled || loading}
            />
          )}
        </div>
      ))}
      <button
        type="submit"
        disabled={disabled || loading}
        className="px-4 py-2 rounded"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};



i alredy have all my backend routes and views and models, serializers set up. i'm only focusing on making it work so that i can carry on the crud from the frontend because curretnly i use the Django admin in the backend to perform those acitons. the only problem is my periods models because i created it with specific periods so which means i will have to remove it from the uniques but we will do that.

here are the models:
academic_year:
from django.db import models
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
from datetime import datetime

class AcademicYear(models.Model):
    name = models.CharField(
        max_length=20,
        unique=True,
        validators=[RegexValidator(r'^\d{4}/\d{4}$', message='Name must be in the format "YYYY/YYYY" (e.g., "2024/2025")')],
    )
    start_date = models.DateField()
    end_date = models.DateField()

    def clean(self):
        """Validate that end_date is after start_date and matches name years."""
        if self.end_date <= self.start_date:
            raise ValidationError('End date must be after start date.')
        if self.name:
            start_year, end_year = map(int, self.name.split('/'))
            if self.start_date.year != start_year or self.end_date.year != end_year:
                raise ValidationError('Start and end dates must match the years in the name.')
            if end_year != start_year + 1:
                raise ValidationError('End year must be one year after start year.')

    def save(self, *args, **kwargs):
        self.full_clean()  # Run clean() before saving
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-start_date']
        
They are added like this: 2024/2025, or 2025/2026 etc....

levels:
from django.db import models
from django.core.validators import RegexValidator

class Level(models.Model):
    name = models.CharField(
        max_length=10,
        unique=True,
        validators=[RegexValidator(r'^\d+$', message='Level name must be a number (e.g., "7" for Grade 7)')],
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Grade {self.name}"

subjects:
from django.db import models
from django.core.validators import RegexValidator
from levels.models import Level

class Subject(models.Model):
    subject = models.CharField(
        max_length=100,
        validators=[RegexValidator(r'^[A-Z][a-zA-Z\s]*(?<!\s)$', message='Subject name must start with a capital letter and contain only letters and spaces, no trailing spaces.')],
    )
    level = models.ForeignKey(Level, on_delete=models.CASCADE, related_name='subjects')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('subject', 'level')

    def __str__(self):
        return f"{self.subject} (Grade {self.level.name})"

periods:
from django.db import models

class Period(models.Model):
    PERIOD_CHOICE = [
        ('1st', '1st period'),
        ('2nd', '2nd period'),
        ('3rd', '3rd period'),
        ('1exam', '1st semester exam'),
        ('4th', '4th period'),
        ('5th', '5th period'),
        ('6th', '6th period'),
        ('2exam', '2nd semester exam'),
    ]

    period = models.CharField(
        max_length=9,
        choices=PERIOD_CHOICE,
        unique=True,
        default='1st'
    )
    is_exam = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        # Automatically infer is_exam based on period value
        self.is_exam = self.period in ['1exam', '2exam']
        super().save(*args, **kwargs)

    def __str__(self):
        return self.get_period_display()

This is the index.ts from the fronend types/index.ts:
import { Errors } from "../hooks/useGradeSheets";

export interface Grade {
  id?: number;
  student_id: number;
  subject_id: number;
  period_id: number;
  score: number;
  enrollment_id?: number;
}

export interface GradeSheetEntry {
  student: Student;
  id?: number;
  student_id: number;
  student_name: string;
  subject_id: number;
  period_id?: number;
  score: number | null;
}

export interface Subject {
  id: number;
  subject: string;
  level_id: number;
}

export interface Period {
  id: number;
  period: string;
  is_exam?: boolean;
}

export interface Level {
  id: number;
  name: string;
  order?: number;
}

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  gender: 'M' | 'F' | 'O';
  dob: string;
  level_id: number;
  level: number | { id: number; name: string } | null;
  academic_year: number | { id: number; name: string };
}

export interface AcademicYear {
  id: number;
  name: string;
  start_date?: string;
  end_date?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface GradeSheet {
  student_id: number;
  student_name: string;
  status: string;
  subjects: {
    subject_id: string;
    subject_name: string;
    first_period: string;
    second_period: string;
    third_period: string;
    first_exam: string;
    fourth_period: string;
    fifth_period: string;
    sixth_period: string;
    second_exam: string;
    sem1_avg: string;
    sem2_avg: string;
    final_avg: string;
    '1st': string;
    '2nd': string;
    '3rd': string;
    '1exam': string;
    '4th': string;
    '5th': string;
    '6th': string;
    '2exam': string;
    '1a': string;
    '2a': string;
    'f': string;
  }[];
}

export interface Enrollment {
  id: number;
  student: Student;
  level: Level;
  academic_year: AcademicYear;
  date_enrolled: string;
}

export interface PassFailedStatus {
  id: number;
  student: {
    id: number;
    firstName: string;
    lastName: string;
  };
  level_id: number;
  academic_year: {
    id: number;
    name: string;
  };
  enrollment?: { id: number };
  grades_complete: boolean;
  status: 'PASS' | 'FAIL' | 'CONDITIONAL' | 'PENDING' | 'INCOMPLETE';
  validated_by?: string;
  template_name?: string;
}

export interface GradeEntry {
  student_id: number;
  score: number | null;
  period_id: number;
}

export interface PostGradesData {
  level: number;
  subject_id: number;
  period_id: number;
  academic_year: number | string;
  grades: GradeEntry[];
}

export interface GradeResponse {
  message: string;
  saved_grades: number[];
  skipped_students: number[];
  errors: { student_id: number; error: string }[];
}

export interface ExistingGrade {
  student_id: number;
  student_name: string;
  score: number | null;
  period_id: number;
}

export interface StudentEnrollmentData {
  firstName: string;
  lastName: string;
  gender: 'M' | 'F' | 'O';
  dob: string;
  level_id: number;
  academic_year_id: number;
  date_enrolled: string;
}

export interface PdfResponse {
  view_url: string;
  message?: string;
  pdf_path?: string;
}

export interface PdfLoading {
  [key: string]: boolean;
}

export interface PdfUrls {
  [key: string]: string;
}

export interface UseGradeSheetsReturn {
  levels: Level[];
  academicYears: AcademicYear[];
  subjects: Subject[];
  periods: Period[];
  selectedLevelId: number | null;
  selectedAcademicYearId: number | null;
  selectedSubjectId: number | null;
  selectedPeriodId: number | null;
  students: Student[];
  gradeSheets: GradeSheet[];
  loading: boolean;
  pdfLoading: PdfLoading;
  errors: Errors;
  pdfUrls: PdfUrls;
  modal: { show: boolean; studentId?: number; action?: string };
  handleLevelChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleAcademicYearChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleGeneratePDF: (levelId: number, studentId?: number) => Promise<void>;
  openModal: (studentId: number | null, action: string) => void;
  closeModal: () => void;
  handleConfirmModal: () => Promise<void>;
}

export interface UseReportCardReturn {
  levels: Level[];
  academicYears: AcademicYear[];
  selectedLevelId: number | null;
  selectedAcademicYearId: number | null;
  statuses: PassFailedStatus[];
  loading: boolean;
  errors: { [key: string]: string };
  pdfUrls: PdfUrls;
  modal: { show: boolean; statusId?: number; action?: string };
  allStatusesReady: boolean;
  handleLevelChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleAcademicYearChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSetStatus: (statusId: number, status: 'PASS' | 'FAIL' | 'CONDITIONAL') => Promise<void>;
  handleGeneratePDF: (studentId?: number) => Promise<void>;
  handlePromoteStudent: (statusId: number) => Promise<void>;
  handleConfirmModal: () => Promise<void>;
  openModal: (statusId: number | null, action: string) => void;
  closeModal: () => void;
}

export interface AdminManagement {
  subjects: Subject[];
}

export type AdminPageSection<T> = {
  title: string;
  FormComponent: React.FC<{
    onSuccess: () => void;
    editingItem?: T | null;
    onCancel?: () => void;
  }>;
  ListComponent: React.FC<{
    onEdit: (item: T) => void;
    onDelete: (item: T) => void;
  }>;
};

export type AdminPageProps<T> = {
  sections: AdminPageSection<T>[];
}; 

this is the css for the admins:
.bomi-theme {
    background-color: var(--background-color);
    color: var(--text-color);
    font-family: Arial, sans-serif;
  }
  
  .bomi-theme h1, .bomi-theme h2, .bomi-theme h3 {
    color: var(--text-color);
  }
  
  .bomi-theme a {
    color: var(--link-color);
    text-decoration: none;
  }
  
  .bomi-theme a:hover {
    text-decoration: underline;
  }
  
  .bomi-theme button, .bomi-theme input, .bomi-theme select {
    border: 1px solid var(--secondary-color);
    background-color: var(--primary-color);
    color: var(--text-color);
    padding: 8px;
    border-radius: 4px;
    transition: all 0.2s ease-in-out;
  }
  
  .bomi-theme button:hover:not(:disabled) {
    background-color: var(--secondary-color);
    color: var(--primary-color);
  }
  
  .bomi-theme button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .bomi-theme select {
    width: 100%;
  }
  
  .bomi-theme input:focus, .bomi-theme select:focus {
    outline: none;
    border-color: var(--secondary-color);
    box-shadow: 0 0 5px rgba(0, 128, 0, 0.3);
  }
  
  /* Responsive container */
  .bomi-theme .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 16px;
  }
  
  /* Card styles for collapsible sections */
  .bomi-theme .card {
    background-color: var(--primary-color);
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  The only thing we will work on in the bckend is the periods so that we can't have static periods. but all focus is on the frontend. 

  my goal is simple:
  when a new school come in, no need going to the backend to add all those, they can just add from the frontend because all school will have unique database. 
  leave the review and feedbacks let focus on working for now. i want after we are done i should understand the why also.

  i have set the router and connect it to my frontend so don't worry about the admin page showing on the fronend when i start my server.


       '1st'
        '2nd', 
        '3rd', 
        '1exam', 
        '4th', 
        '5th', 
        '6th', 
        '2exam'
    