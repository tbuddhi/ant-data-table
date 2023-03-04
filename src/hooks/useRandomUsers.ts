import { useState } from 'react'
import type { TablePaginationConfig } from 'antd/es/table';
import type { FilterValue } from 'antd/es/table/interface';
import qs from 'qs';

// const apiURL: string = process.env.API_URL + '/api'
const { REACT_APP_API_URL } = process.env;
interface DataType {
    name: {
        first: string;
        last: string;
    };
    gender: string;
    email: string;
    login: {
        uuid: string;
    };
    phone: string;
    picture: {
        thumbnail: string;
    }
}
interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: string;
    sortOrder?: string;
    filters?: Record<string, FilterValue>;
}

const getUserParams = (params: TableParams) => ({
    results: params.pagination?.pageSize,
    page: params.pagination?.current,
    ...params,
});

// using this hook to fetch random users from API
const useRandomUsers = () => {
    const [data, setData] = useState<DataType[]>();
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 8,
        },
    });

    const fetchData = () => {
        setLoading(true);
        fetch(`${REACT_APP_API_URL}?${qs.stringify(getUserParams(tableParams))}`)
            .then((res) => res.json())
            .then(({ results }) => {
                setData(results);
                setLoading(false);
                setTableParams({
                    ...tableParams,
                    pagination: {
                        ...tableParams.pagination,
                        total: 100
                    },
                });
            });
    };

    return { data, setData, loading, tableParams, setTableParams, fetchData }
}

export default useRandomUsers

