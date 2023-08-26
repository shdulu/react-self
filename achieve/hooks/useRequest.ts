import { useState, useEffect } from "react";

interface IItem {
  id: number;
  name: string;
}
interface IData {
  pageSize: number;
  currentPage: number;
  totalPage: number;
  list: IItem[];
}
interface IOptions {
  currentPage: number;
  pageSize: number;
}

const useRequest = (URL: string): [IData, IOptions, Function] => {
  const [options, setOptions] = useState({
    currentPage: 1,
    pageSize: 5,
  });
  const [data, setData] = useState<IData>({
    currentPage: 1,
    pageSize: 5,
    totalPage: 0,
    list: [],
  });

  const queryData = () => {
    let { currentPage, pageSize } = options;
    fetch(`${URL}?currentPage=${currentPage}&pageSize=${pageSize}`)
      .then((response) => response.json())
      .then((result) => {
        setData({ ...result });
      });
  };
  useEffect(queryData, [options, URL]);
  return [data, options, setOptions];
};
export default useRequest;
