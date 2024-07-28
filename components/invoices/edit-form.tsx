'use client';

import { CustomerField, InvoiceForm } from '@/lib/definitions';
import {
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon, LockClosedIcon, LockOpenIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import {updateInvoice} from '@/lib/actions';
import {Button} from "@/components/button";

export default function EditInvoiceForm({
  invoice,
  customers,
}: {
  invoice: InvoiceForm;
  customers: CustomerField[];
}) {
  const updateInvoiceWithId = updateInvoice.bind(null, invoice.id);

  return (
    <form action={updateInvoiceWithId}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Publisher
          </label>
          <div className="relative">
            <input
              id="publisher"
              name="publisher"
              type="text"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={invoice.customer_id}
            >
            </input>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="publicationYear" className="mb-2 block text-sm font-medium">
            Publication Year
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="publicationYear"
                name="publicationYear"
                type="number"
                step="1"
                defaultValue={invoice.amount}
                placeholder="2024"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Invoice Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Resource Status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="m-4 gap-2">
              <div className="flex items-center">
                <input
                  id="volatile"
                  name="status"
                  type="radio"
                  value="volatile"
                  defaultChecked={invoice.status === 'volatile'}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="volatile"
                  className="ml-2 w-full flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500  px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Volatile <LockOpenIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="fixed"
                  name="status"
                  type="radio"
                  value="fixed"
                  defaultChecked={invoice.status === 'fixed'}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="fixed"
                  className="ml-2  w-full flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Fixed <LockClosedIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Button type="submit">Filter</Button>
      </div>
    </form>
  );
}
