import  { useDispatch } from "react-redux";

import type { RootState } from "../store/index";
import type { Period } from "../types";
import type { AppDispatch } from "../store/index";
import { useSelector } from "react-redux";
import { fetchPeriods } from "../slices/periodsSlice";

export const usePeriods = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {data, loading, error } = useSelector((state: RootState)=>state.periods);
  const loadPeriods = () => dispatch(fetchPeriods());
  return {periods: data as Period[], loading, error, loadPeriods};
}
