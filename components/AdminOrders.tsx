"use client";

// *********************
// Role of the component: Component that displays all orders on admin dashboard page
// Name of the component: AdminOrders.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <AdminOrders />
// Input parameters: No input parameters
// Output: Table with all orders
// *********************

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BASE_URL } from "@/utils/base_url";

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch(`${BASE_URL}/api/orders`);
      const data = await response.json();
      setOrders(data);
    };
    fetchOrders();
  }, []);

  return (
    <div className="xl:ml-5 w-full max-xl:mt-5 ">
      <h1 className="text-3xl font-semibold text-center mb-5">All orders</h1>
      <div className="overflow-x-auto">
        <table className="daisy-table daisy-table-md daisy-table-pin-cols">
          {/* head */}
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="daisy-checkbox" />
                </label>
              </th>
              <th>Order ID</th>
              <th>Name and country</th>
              <th>Status</th>
              <th>Subtotal</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {orders &&
              orders.map((order) => (
                <tr key={order?.id}>
                  <th>
                    <label>
                      <input type="checkbox" className="daisy-checkbox" />
                    </label>
                  </th>

                  <td>
                    <div>
                      <p className="font-bold">#{order?.id}</p>
                    </div>
                  </td>

                  <td>
                    <div className="flex items-center gap-5">
                      <div>
                        <div className="font-bold">{order?.name}</div>
                        <div className="text-sm opacity-50">
                          {order?.country}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="daisy-badge daisy-badge-success text-white badge-sm">
                      {order?.status}
                    </span>
                  </td>

                  <td>
                    <p>${order?.total}</p>
                  </td>

                  <td>
                    {new Date(Date.parse(order?.dateTime)).toDateString()}
                  </td>
                  <th>
                    <Link
                      href={`/admin/orders/${order?.id}`}
                      className="daisy-btn daisy-btn-ghost daisy-btn-xs"
                    >
                      details
                    </Link>
                  </th>
                </tr>
              ))}
          </tbody>
          {/* foot */}
          <tfoot>
            <tr>
              <th></th>
              <th>Order ID</th>
              <th>Name and country</th>
              <th>Status</th>
              <th>Subtotal</th>
              <th>Date</th>
              <th></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
