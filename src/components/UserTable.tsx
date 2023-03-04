import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, Space, Table } from 'antd';
import type { InputRef } from 'antd';
import type { ColumnsType, ColumnType, TableProps, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, FilterConfirmProps } from 'antd/es/table/interface';
import { FilterFilled } from '@ant-design/icons';
import qs from 'qs';
import Highlighter from 'react-highlight-words';

// import useRandomUsers from '../hooks/useRandomUsers';

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

type DataIndex = keyof DataType;

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

const DataTable: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const [data, setData] = useState<DataType[]>();
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 8,
        },
    });

    // const { data, setData, loading, fetchData, tableParams, setTableParams } = useRandomUser()

    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<FilterFilled />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Filter
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <FilterFilled style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns: ColumnsType<DataType> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: {
                compare: (a, b) => a.name.first.localeCompare(b.name.first),
                multiple: 3,
            },
            render: (name) => `${name.first} ${name.last}`,
            fixed: 'left',
            width: '20%',
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            sorter: {
                compare: (a, b) => a.gender.localeCompare(b.gender),
                multiple: 2,
            },
            fixed: 'left',
            width: '20%'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: {
                compare: (a, b) => a.email.localeCompare(b.email),
                multiple: 1,
            },
            ...getColumnSearchProps('email'),
            fixed: 'left',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            ...getColumnSearchProps('phone'),
            fixed: 'left',
        },
    ];

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
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(tableParams)]);

    const onTableChange: TableProps<DataType>['onChange'] = (pagination, sorter) => {
        // console.log('params', pagination, filters, sorter, extra);
        setTableParams({
            pagination,
            ...sorter,
        });
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
    };

    return (
        <Table
            columns={columns}
            pagination={tableParams.pagination}
            rowKey={(record) => record.login.uuid}
            dataSource={data}
            loading={loading}
            onChange={onTableChange}
        />
    )
};

export default DataTable;
