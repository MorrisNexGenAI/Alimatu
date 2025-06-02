import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { getSubjects } from '../api/subjects'
import type { Subject } from '../types'

interface SubjectsState {
    data:Subject[];
    loading:boolean;
    error:string |null;
}
const initialState:SubjectsState = {
    data:[],
    loading:false,
    error:null,
};
export const fetchSubjects = createAsyncThunk('subjects/fetchSubjects',
    async() => {
        return await getSubjects();
    }
)

const subjectsSlice = createSlice ({
    name: 'subjects',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchSubjects.pending, (state)=>{
            state.loading=true;
            state.error = null;
        })
        .addCase(fetchSubjects.fulfilled, (state, action)=>{
            state.loading=false;
            state.data=action.payload;
        })
        .addCase(fetchSubjects.rejected,(state, action)=>{
            state.loading=false;
            state.error = action.error.message || 'failed to fetch subject';
        })
    }
})

export default subjectsSlice.reducer;