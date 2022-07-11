import { IGridDataResults } from "./gridDataResults";

export interface IApiResponse{
  totalResultCount: number,
  results: IGridDataResults[]
}
