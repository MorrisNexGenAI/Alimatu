import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { getPeriods } from '../api/periods'
import type { Period } from '../types'

interface PeriodsState {
    data:Period[];
    loading:boolean;
    error:string|null;
}

const initialState:PeriodsState= {
    data:[],
    loading:false,
    error:null,
};

export const fetchPeriods = createAsyncThunk('periods/fetchPeriods', 
    async () =>{ return await getPeriods();
});

const periodsSlice = createSlice({
    name:'periods',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchPeriods.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(fetchPeriods.fulfilled,(state, action)=>{
            state.loading=false;
            state.data = action.payload;
        })
        .addCase(fetchPeriods.rejected,(state, action)=>{
            state.loading=false;
            state.error = action.error.message ||'failed to fetch periods'
        })
    }
})

export default periodsSlice.reducer;