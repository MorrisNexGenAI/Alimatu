import  { useDispatch } from "react-redux";
import { fetchLevels } from "../slices/levelsSlice";
import type { RootState } from "../store/index";
import type { Level } from "../types";
import type { AppDispatch } from "../store/index";
import { useSelector } from "react-redux";

export const useLevels = () =>{
  const dispatch = useDispatch<AppDispatch>();
  const {data, loading, error} = useSelector((state: RootState)=>state.levels);
  const loadLevels = () =>dispatch(fetchLevels());
  return {levels: data as Level[], loading, error, loadLevels};
};