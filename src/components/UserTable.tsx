import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Button, Input, Space, Table } from 'antd';
import type { InputRef } from 'antd';
import type { ColumnsType, ColumnType, TableProps } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import { FilterFilled } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

import useRandomUsers from '../hooks/useRandomUsers';
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

type DataIndex = keyof DataType;

const DataTable: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const { data, setData, loading, fetchData, tableParams, setTableParams } = useRandomUsers()

    // Handle filter search
    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    // Handle filter reset
    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    // Implement filter props for all columns
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

    // Initialize table columns
    const columns: ColumnsType<DataType> = [
        {
            title: '',
            dataIndex: 'picture',
            key: 'picture',
            render: (_, { picture }) => (
                <Avatar
                    size={{ xs: 28, sm: 32, md: 40 }}
                    src={picture.thumbnail}
                />
            ),
            width: '5%',
            fixed: 'left',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: {
                compare: (a, b) => a.name.first.localeCompare(b.name.first)
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
                compare: (a, b) => a.gender.localeCompare(b.gender)
            },
            fixed: 'left',
            width: '15%'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: {
                compare: (a, b) => a.email.localeCompare(b.email)
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

    // Handle data fetching when table is changed
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(tableParams)]);

    // Handle pagination and table events when onChange
    const onTableChange: TableProps<DataType>['onChange'] = (pagination, sorter) => {
        setTableParams({
            pagination,
            ...sorter,
        });
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
    };

    // Handle user table UI
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
