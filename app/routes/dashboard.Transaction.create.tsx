import { Link, useActionData, Form, useLoaderData } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/server-runtime";
import { redirect, json } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { createTransaction } from "~/models/dashboard/Transaction.server";
import { requireUserId } from "~/session.server";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";

import { getUserListItems } from "~/models/dashboard/User.server";
import { getCategoryListItems } from "~/models/dashboard/Category.server";

function getClassName(error: boolean) {
  const errorClasses =
    "pr-10 text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500 ";
  const normalClasses =
    "text-gray-900 shadow-sm ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600";
  const className =
    "block w-full rounded-md border-0 py-1.5 pl-2 sm:text-sm sm:leading-6 focus:ring-inset ring-1 focus:ring-2 ring-inset ";

  return error ? className + errorClasses : className + normalClasses;
}

export async function action({ request }: ActionArgs) {
  const user = await requireUserId(request);
  const formData = await request.formData();
  const { description, amount, date, userId, categoryId } =
    Object.fromEntries(formData);

  const errors = {
    description: description ? null : "Description is required",
    amount: amount ? null : "Amount is required",
    date: date ? null : "Date is required",
    userId: userId ? null : "User is required",
    categoryId: categoryId ? null : "Category is required",
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json(errors);
  }

  invariant(typeof description === "string", "Invalid description");
  invariant(typeof amount === "string", "Invalid amount");
  invariant(typeof date === "string", "Invalid date");
  invariant(typeof userId === "string", "Invalid userId");
  invariant(typeof categoryId === "string", "Invalid categoryId");

  await createTransaction({
    description,
    amount: Number(amount),
    date: new Date(date),
    userId,
    categoryId,
  });

  return redirect(`/dashboard/Transaction`);
}

export async function loader() {
  const users = await getUserListItems();
  const categories = await getCategoryListItems();
  return {
    users,
    categories,
  };
}

export default function CreateTransaction() {
  const { users, categories } = useLoaderData<typeof loader>();
  const errors = useActionData<typeof action>();

  return (
    <div>
      <h2>Create a new Transaction</h2>
      <Form method="post">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Description
              </label>
              <div className="relative mt-2">
                <input
                  type="text"
                  id="description"
                  name="description"
                  defaultValue={""}
                  className={getClassName(Boolean(errors?.description))}
                  required={true}
                />
                {errors?.description ? (
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <ExclamationCircleIcon
                      className="h-5 w-5 text-red-500"
                      aria-hidden="true"
                    />
                  </div>
                ) : null}
              </div>
              {errors?.description ? (
                <p className="mt-2 text-sm text-red-600" id="email-error">
                  {errors?.description}
                </p>
              ) : null}
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="amount"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Amount
              </label>
              <div className="relative mt-2">
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  defaultValue={""}
                  className={getClassName(Boolean(errors?.amount))}
                  required={true}
                />
                {errors?.amount ? (
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <ExclamationCircleIcon
                      className="h-5 w-5 text-red-500"
                      aria-hidden="true"
                    />
                  </div>
                ) : null}
              </div>
              {errors?.amount ? (
                <p className="mt-2 text-sm text-red-600" id="email-error">
                  {errors?.amount}
                </p>
              ) : null}
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="date"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Date
              </label>
              <div className="relative mt-2">
                <input
                  type="datetime-local"
                  id="date"
                  name="date"
                  defaultValue={""}
                  className={getClassName(Boolean(errors?.date))}
                  required={true}
                />
                {errors?.date ? (
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <ExclamationCircleIcon
                      className="h-5 w-5 text-red-500"
                      aria-hidden="true"
                    />
                  </div>
                ) : null}
              </div>
              {errors?.date ? (
                <p className="mt-2 text-sm text-red-600" id="email-error">
                  {errors?.date}
                </p>
              ) : null}
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="userId"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                User
              </label>
              <div className="relative mt-2">
                <select
                  id="userId"
                  name="userId"
                  defaultValue={""}
                  className={getClassName(Boolean(errors?.userId))}
                >
                  <option value="" disabled>
                    Select user
                  </option>
                  {users.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.id}
                    </option>
                  ))}
                </select>
                {errors?.userId ? (
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <ExclamationCircleIcon
                      className="h-5 w-5 text-red-500"
                      aria-hidden="true"
                    />
                  </div>
                ) : null}
              </div>
              {errors?.userId ? (
                <p className="mt-2 text-sm text-red-600" id="email-error">
                  {errors?.userId}
                </p>
              ) : null}
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="categoryId"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Category
              </label>
              <div className="relative mt-2">
                <select
                  id="categoryId"
                  name="categoryId"
                  defaultValue={""}
                  className={getClassName(Boolean(errors?.categoryId))}
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {categories.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.id}
                    </option>
                  ))}
                </select>
                {errors?.categoryId ? (
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <ExclamationCircleIcon
                      className="h-5 w-5 text-red-500"
                      aria-hidden="true"
                    />
                  </div>
                ) : null}
              </div>
              {errors?.categoryId ? (
                <p className="mt-2 text-sm text-red-600" id="email-error">
                  {errors?.categoryId}
                </p>
              ) : null}
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Link to="/dashboard/Transaction">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </button>
          </Link>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Create Transaction
          </button>
        </div>
      </Form>
    </div>
  );
}
