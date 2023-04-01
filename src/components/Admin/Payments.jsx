import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../axios-client";

export default function Payments() {
  const [Payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toggleForm, setToggleForm] = useState(false);
  const [editpayment, setEditpayment] = useState();

  const getPayments = () => {
    setLoading(true);
    axiosClient
      .get("/admin/payments")
      .then(({ data }) => {
        console.log(data);
        setPayments(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    getPayments();
  }, []);

  const ontoggle = (payment) => {
    setEditpayment(payment);
    setToggleForm(true);
  };

  const unToggle = (ev) => {
    setToggleForm(false);
  };

  const onDelete = (payment) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) {
      return;
    }

    axiosClient.delete(`/admin/payments/${payment.id}`).then(() => {
      //Notify
      getPayments();
    });
  };

  return (
    <div className="m-2 md:mt-20 mt-24 h-auto p-2 md:p-10 bg-white rounded-3xl">
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="p-4">
                Id
              </th>

              <th scope="col" class="px-6 py-3">
                Amount
              </th>
              <th scope="col" class="px-6 py-3">
                Status
              </th>
              <th scope="col" class="px-6 py-3">
                User id
              </th>
              <th scope="col" class="px-6 py-3">
                Date
              </th>
              <th scope="col" class="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {Payments.map((payment) => (
              <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td class="px-6 py-4">{payment.id}</td>
                <th
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  ${payment.total_price} USD
                </th>
                <td class="px-6 py-4">
                  {payment.status === "Succeeded" && (
                    <span class="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                      {payment.status}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke=""
                        class="w-4 h-4 stroke-green-500"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    </span>
                  )}
                  {payment.status === "Pending" && (
                    <span class="inline-flex items-center bg-amber-100 text-amber-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-amber-900 dark:text-amber-300">
                      {payment.status}
                    </span>
                  )}
                  {payment.status === "Cancelled" && (
                    <span class="inline-flex items-center bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
                      {payment.status}
                    </span>
                  )}
                </td>
                <td class="px-6 py-4">{payment.user_id}</td>
                <td class="px-6 py-4">{payment.created_at}</td>
                <td class="px-6 py-4">
                  <div className="flex flex-row">
                    <Link onClick={(ev) => onDelete(payment)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5 stroke-red-500"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
