"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">

      {/* HEADER */}

      <header className="flex items-center justify-between border-b bg-white px-8 py-5">

        <h1 className="text-2xl font-bold">
          Logistics Optimizer
        </h1>

        <div className="flex gap-4">

          <button
            onClick={() => router.push("/login")}
            className="rounded-lg border border-blue-600 px-5 py-2 font-medium text-blue-600 hover:bg-blue-50"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/register")}
            className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
          >
            Register
          </button>

        </div>

      </header>

      {/* HERO */}

      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6">

        <div className="max-w-3xl text-center">

          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Logistics Management System
          </p>

          <h2 className="mt-4 text-5xl font-bold tracking-tight text-slate-900">
            Optimize Your Logistics Operations
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-500">
            Manage orders, inventory and warehouses in one place.
            Automatically select warehouses based on inventory
            availability and delivery destinations.
          </p>

          <div className="mt-8 flex justify-center gap-4">

            <button
              onClick={() => router.push("/login")}
              className="rounded-lg bg-blue-600 px-7 py-3 font-medium text-white hover:bg-blue-700"
            >
              Login
            </button>

            <button
              onClick={() => router.push("/register")}
              className="rounded-lg border border-slate-300 bg-white px-7 py-3 font-medium text-slate-700 hover:bg-slate-50"
            >
              Register
            </button>

          </div>

          <p className="mt-6 text-sm text-slate-500">
            Not a user yet?{" "}

            <button
              onClick={() => router.push("/register")}
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Register here
            </button>

          </p>

        </div>

      </main>

    </div>
  );
}