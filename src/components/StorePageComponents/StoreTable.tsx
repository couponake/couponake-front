'use client'
import React from 'react'

interface StoreProps {
    store: {
        id: number;
        code: string;
        title: string;
        description: string;
    }[];
    t: any;
}

function StoreTable({ store, t }: StoreProps) {
    return (
        <div className="prose max-w-none min-w-64 my-3">
            <table className="table-auto w-full border-collapse border rounded-lg border-gray-200">
                <tbody>
                    <tr>
                        <th
                            className="border border-gray-300 px-4 py-2"
                            scope="col"
                        >
                            {t("Code")}
                        </th>
                        <th
                            className="border border-gray-300 px-4 py-2"
                            scope="col"
                        >
                            {t("Title")}
                        </th>
                        <th
                            className="border border-gray-300 px-4 py-2"
                            scope="col"
                        >
                            {t("Description")}
                        </th>
                    </tr>
                    {store?.map((item) => (
                        <tr className="even:bg-gray-200" key={item?.id}>
                            <td className="border border-gray-300 px-4 py-2">
                                {item?.code}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                {item?.title}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                {item?.description}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default StoreTable
