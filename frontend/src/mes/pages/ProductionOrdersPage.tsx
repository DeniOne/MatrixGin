import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Card, message } from 'antd';
import { mesApi, ProductionOrder } from '../../api/mes.api';
import { Link } from 'react-router-dom';

const ProductionOrdersPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState<ProductionOrder[]>([]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await mesApi.getOrders();
            setOrders(data);
        } catch (err) {
            message.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
            render: (id: string) => <Link to={`/mes/orders/${id}`}>{id.substring(0, 8)}...</Link>
        },
        {
            title: 'Product',
            dataIndex: 'product_type',
            key: 'product_type',
        },
        {
            title: 'Qty',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Source',
            dataIndex: 'source_type',
            key: 'source_type',
            render: (source: string) => <Tag>{source}</Tag>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = 'default';
                if (status === 'COMPLETED') color = 'success';
                if (status === 'IN_PROGRESS') color = 'processing';
                if (status === 'CANCELLED') color = 'error';
                return <Tag color={color}>{status}</Tag>;
            }
        },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (val: string) => new Date(val).toLocaleDateString()
        }
    ];

    return (
        <Card title="Production Orders" extra={<Button onClick={fetchOrders}>Refresh</Button>}>
            <Table
                dataSource={orders}
                columns={columns}
                rowKey="id"
                loading={loading}
            />
        </Card>
    );
};

export default ProductionOrdersPage;
