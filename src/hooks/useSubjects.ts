import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../api';
import type { Level, Subject } from '../types/index';

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