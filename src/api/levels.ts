// hooks/useLevels.ts
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiClient } from '../api/apiClient';
import type { Level } from '../types';



export const useLevels = () =>{
    const [levels, setLevels] = useState<Level[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null)


const fetchLevel = async () =>{
    setLoading(true);
    try {
        const data = await apiClient.levels.getLevels();
        setLevels(data);
        setError(null)
    } catch (err:any) {
        const errorMessage = err.response?.data.message || 'failed to fetch level'
        setError(errorMessage)
        toast.error(errorMessage)
} finally {
    setLoading(false)
}
    }
useEffect(()=>{
    fetchLevel()
},[]);

const addLevel = async(data:{name:string}) =>{
    setLoading(true);
    try {
        const newLevel = await apiClient.levels.createLevel(data);
        setLevels([...levels, newLevel])
        toast.success('level created successfull')
        setError(null)
    } catch (err:any) {
        const errorMessage = err.response?.data.message || 'failed to create level'
        setError(errorMessage)
        toast.error(errorMessage)
    } finally{
        setLoading(false)
    }
}

const editLevel = async(id:number, data:{name:string}) =>{
    setLoading(true)
    try {
        const updatedLevel = await apiClient.levels.updateLevel(id, data);
        const levelMap = (levels.map((l)=> (l.id === id ? updatedLevel : l)));
        setLevels(levelMap)
        toast.success('level updated successfully')
        setError(null)
    } catch (err:any) {
        const errorMessage = err.response?.data.message || 'failed to update level'
        setError(errorMessage)
        toast.error(errorMessage)
    } finally {
        setLoading(false)
    }
}
const deleteLevel = async(id:number) =>{
    setLoading(true)
    try {
        await apiClient.levels.deleteLevel(id)
        const filteredLevel = (levels.filter((l)=> l.id !== id))
        setLevels(filteredLevel)
        toast.success('level deleted successfully')
        setError(null)
    } catch (err:any) {
        const errorMessage = err.response?.data.message || 'failed to delete level'
        setError(errorMessage)
        toast.error(errorMessage)
    } finally {
        setLoading(false)
    }
}
return {
    levels,
    loading,
    deleteLevel,
    addLevel,
    editLevel,
    fetchLevel
}
}