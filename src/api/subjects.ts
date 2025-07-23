import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { apiClient } from '../api/apiClient';
import type { Level, Subject } from '../types/index';

export const useSubject = () =>{
    const [levels, setLevels] = useState<Level[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);

useEffect(()=>{
    const fetchLevelData = async()=>{
        setLoading(true);
        try {
            const levelResults = await apiClient.levels.getLevels();

        } catch (err:any) {
            console.error('failed to load level',JSON.stringify({
                message:err.message,
                response:err.response?.data,
                status:err.response?.status,
            },null,2));
            toast.error('failed to fetch level data')
            setLevels([])
        } finally {
            setLoading(false)
        }
    }
    fetchLevelData()
},[]);


useEffect(()=>{
    if(!selectedLevelId){
        toast.error('please select level')
        return;
    }
    const fetchSubjects = async () =>{
        setLoading(true);
        try {
            const subjectRespone = await apiClient.subjects.getSubjectsByLevel(selectedLevelId);
        } catch (err:any) {
            console.error('Error fetching subjects',JSON.stringify({
                message:err.message,
                response:err.response?.data,
                status:err.response?.status
            },null,2))
            toast.error('failed to fetch subjects')
            setSubjects([]);
        } finally {
            setLoading(false)
        }
    } 
    fetchSubjects();
},[])

const createSubject = async (data:{
    subject:string;
    level_id:number;
    level:number;
}) =>{
    if(!selectedLevelId){
        toast.error('please select level to creaete subject')
        return;
    }
    setLoading(true);
    try {
        const newSubject = await apiClient.subjects.createSubject(data);
       const updatedSubject = await apiClient.subjects.getSubjectsByLevel(selectedLevelId);
        setSubjects(updatedSubject);
        toast.success('subject created successfully')
    } catch (err:any){
        console.error('error creating subject',err);
        toast.error(err.response?.data.err)
    } finally{
        setLoading(false)
    }
}



const handleLevelChange = (e:React.ChangeEvent<HTMLSelectElement>) =>{
    const levelId = parseInt(e.target.value) || null;
    setSelectedLevelId(levelId)
    console.log('Selected level ID:',levelId)
};
return {
    subjects,
    levels,
    selectedLevelId,
    loading,
    handleLevelChange,
    createSubject,
    
}
}