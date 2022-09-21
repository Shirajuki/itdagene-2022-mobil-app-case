import { Employee } from "../hooks/useFetchEmployees";
import _ from "lodash";

export default (array: Employee[]) => _.shuffle(array);