import React, { useEffect, useState } from 'react'
import type { ColumnsType, ColumnType, TableProps, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, FilterConfirmProps } from 'antd/es/table/interface';
import qs from 'qs';

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

const useRandomUser = () => {
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
    fetch(`https://randomuser.me/api?${qs.stringify(getUserParams(tableParams))}`)
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

        // return fetchData;
};

  return {data, setData, loading, tableParams, setTableParams, fetchData}
}

export default useRandomUser

