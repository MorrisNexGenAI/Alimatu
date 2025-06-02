import  { useDispatch } from "react-redux";

import type { RootState } from "../store/index";
import type { Subject } from "../types";
import type { AppDispatch } from "../store/index";
import { useSelector } from "react-redux";

import { fetchSubjects } from "../slices/subjectsSlice";

export const useSubjects = () =>{
  const dispatch = useDispatch<AppDispatch>();
  const {data, loading, error } = useSelector((state: RootState)=>state.subjects);
  const loadSubjects = () => dispatch(fetchSubjects());
  return {subjects:data as Subject[], loading, error, loadSubjects};

}