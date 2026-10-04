"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [activePage, setActivePage] = useState("Dashboard");
  const [userRole, setUserRole] = useState("");

  const [warehouses, setWarehouses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);

  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingInventory, setLoadingInventory] = useState(true);

  const [message, setMessage] = useState("");

  // Create Order
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [destination, setDestination] = useState("");
  const [creatingOrder, setCreatingOrder] = useState(false);

  // Route Optimization
  const [routeProduct, setRouteProduct] = useState("");
  const [routeQuantity, setRouteQuantity] = useState("");
  const [routeDestination, setRouteDestination] = useState("");
  const [routeResult, setRouteResult] = useState(null);
  const [findingRoute, setFindingRoute] = useState(false);

  // Get orders
  const fetchOrders = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      const data = await response.json();

      setOrders(data);
      setLoadingOrders(false);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setLoadingOrders(false);
    }
  };

  // Get inventory
  const fetchInventory = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/inventory"
      );

      const data = await response.json();

      if (response.ok) {
        setInventory(data);
      }

      setLoadingInventory(false);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
      setLoadingInventory(false);
    }
  };

  // Create order
  const createOrder = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    setCreatingOrder(true);
    setMessage("");

    try {
      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      const userId = payload.id;

      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: userId,
            product_name: product,
            quantity: Number(quantity),
            destination: destination,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Failed to create order"
        );
        setCreatingOrder(false);
        return;
      }

      setMessage(
        `Order created successfully. Warehouse ID: ${data.warehouse_id}`
      );

      setProduct("");
      setQuantity("");
      setDestination("");

      await fetchOrders();
      await fetchInventory();

      setCreatingOrder(false);

      setTimeout(() => {
        setMessage("");
      }, 5000);
    } catch (error) {
      console.error(error);

      setMessage("Unable to create order");

      setCreatingOrder(false);
    }
  };

  // Find optimal warehouse
  const findOptimalRoute = async (event) => {
    event.preventDefault();

    setFindingRoute(true);
    setRouteResult(null);
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/inventory/select/${encodeURIComponent(
          routeProduct
        )}/${routeQuantity}?destination=${encodeURIComponent(
          routeDestination
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Unable to find warehouse"
        );

        setFindingRoute(false);
        return;
      }

      setRouteResult(data.warehouse);

      setFindingRoute(false);
    } catch (error) {
      console.error(error);

      setMessage("Unable to connect to the server");

      setFindingRoute(false);
    }
  };

  // Update order status - Admin only
  const updateOrderStatus = async (orderId, status) => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Failed to update order"
        );
        return;
      }

      setMessage(
        "Order status updated successfully."
      );

      await fetchOrders();

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error(error);

      setMessage("Failed to update order");
    }
  };

  // Initial data loading
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      setUserRole(payload.role);
    } catch (error) {
      console.error("Invalid token");

      localStorage.removeItem("token");
      router.push("/login");

      return;
    }

    fetch("http://localhost:5000/api/warehouses")
      .then((response) => response.json())
      .then((data) => {
        setWarehouses(data);
      })
      .catch((error) => {
        console.error(
          "Failed to fetch warehouses:",
          error
        );
      });

    fetchOrders();
    fetchInventory();
  }, []);

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">

      {/* SIDEBAR */}

      <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white">

        <div className="p-6">

          <h1 className="text-2xl font-bold">
            Logistics Optimizer
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Logistics Management System
          </p>

        </div>

        <nav className="mt-6 px-4">

          {[
            "Dashboard",
            ...(userRole === "admin"
              ? ["Orders", "Inventory"]
              : []),
            "Warehouses",
          ].map((item) => (

            <button
              key={item}
              onClick={() => setActivePage(item)}
              className={`mb-2 w-full rounded-lg px-4 py-3 text-left transition ${
                activePage === item
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              {item}
            </button>

          ))}

        </nav>

      </aside>

      {/* MAIN CONTENT */}

      <main className="ml-64 min-h-screen p-8">

        {/* HEADER */}

        <div className="mb-8 flex items-center justify-between">

          <div>

            <h2 className="text-3xl font-bold">
              {activePage}
            </h2>

            <p className="mt-1 text-slate-500">
              Manage your logistics operations
            </p>

          </div>

          <div className="flex items-center gap-4">

            {/* ROLE */}

            <div className="rounded-lg bg-white px-4 py-2 shadow-sm">

              <span className="text-sm text-slate-500">
                Role
              </span>

              <span className="ml-2 font-semibold capitalize text-blue-600">
                {userRole || "User"}
              </span>

            </div>

            {/* SYSTEM STATUS */}

            <div className="rounded-lg bg-white px-4 py-2 shadow-sm">

              <span className="text-sm text-slate-500">
                System Status
              </span>

              <span className="ml-2 font-semibold text-green-600">
                ● Online
              </span>

            </div>

            {/* LOGOUT */}

            <button
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/");
              }}
              className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
            >
              Logout
            </button>

          </div>

        </div>

        {/* MESSAGE */}

        {message && (

          <div className="mb-6 rounded-lg bg-green-100 p-4 text-green-700">
            {message}
          </div>

        )}

        {/* DASHBOARD */}

        {activePage === "Dashboard" && (

          <>

            {/* STATISTICS */}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">

              <div className="rounded-xl bg-white p-6 shadow-sm">

                <p className="text-sm text-slate-500">
                  Total Orders
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {orders.length}
                </p>

              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">

                <p className="text-sm text-slate-500">
                  Warehouses
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {warehouses.length}
                </p>

              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">

                <p className="text-sm text-slate-500">
                  Inventory Records
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {inventory.length}
                </p>

              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">

                <p className="text-sm text-slate-500">
                  Pending Orders
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {pendingOrders.length}
                </p>

              </div>

            </div>

            {/* CREATE ORDER + ROUTE OPTIMIZATION */}

            <div className="mt-8 grid gap-8 lg:grid-cols-2">

              {/* CREATE ORDER */}

              <div className="rounded-xl bg-white p-6 shadow-sm">

                <h3 className="text-xl font-semibold">
                  Create Order
                </h3>

                <p className="mt-2 text-slate-500">
                  Create an order and automatically select the best warehouse.
                </p>

                <form
                  onSubmit={createOrder}
                  className="mt-6"
                >

                  <div className="space-y-4">

                    <input
                      type="text"
                      placeholder="Product e.g. Laptop"
                      value={product}
                      onChange={(event) =>
                        setProduct(event.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                      required
                    />

                    <input
                      type="number"
                      placeholder="Quantity"
                      value={quantity}
                      onChange={(event) =>
                        setQuantity(event.target.value)
                      }
                      min="1"
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                      required
                    />

                    <input
                      type="text"
                      placeholder="Destination e.g. Galway"
                      value={destination}
                      onChange={(event) =>
                        setDestination(event.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                      required
                    />

                  </div>

                  <button
                    type="submit"
                    disabled={creatingOrder}
                    className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    {creatingOrder
                      ? "Creating Order..."
                      : "Create Order"}
                  </button>

                </form>

              </div>

              {/* ROUTE OPTIMIZATION */}

              <div className="rounded-xl bg-white p-6 shadow-sm">

                <h3 className="text-xl font-semibold">
                  Route Optimization
                </h3>

                <p className="mt-2 text-slate-500">
                  Find the best warehouse based on stock and destination.
                </p>

                <form
                  onSubmit={findOptimalRoute}
                  className="mt-6"
                >

                  <div className="space-y-4">

                    <input
                      type="text"
                      placeholder="Product e.g. Laptop"
                      value={routeProduct}
                      onChange={(event) =>
                        setRouteProduct(event.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                      required
                    />

                    <input
                      type="number"
                      placeholder="Quantity"
                      value={routeQuantity}
                      onChange={(event) =>
                        setRouteQuantity(event.target.value)
                      }
                      min="1"
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                      required
                    />

                    <input
                      type="text"
                      placeholder="Destination e.g. Galway"
                      value={routeDestination}
                      onChange={(event) =>
                        setRouteDestination(event.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                      required
                    />

                  </div>

                  <button
                    type="submit"
                    disabled={findingRoute}
                    className="mt-6 rounded-lg bg-purple-600 px-6 py-3 font-medium text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    {findingRoute
                      ? "Finding Route..."
                      : "Find Optimal Route"}
                  </button>

                </form>

                {routeResult && (

                  <div className="mt-6 rounded-lg bg-slate-50 p-5">

                    <h4 className="font-semibold text-slate-900">
                      Recommended Warehouse
                    </h4>

                    <div className="mt-4 space-y-2 text-sm">

                      <p>
                        <span className="font-medium">
                          Warehouse:
                        </span>{" "}
                        {routeResult.warehouse_name}
                      </p>

                      <p>
                        <span className="font-medium">
                          Location:
                        </span>{" "}
                        {routeResult.location}
                      </p>

                      <p>
                        <span className="font-medium">
                          Product:
                        </span>{" "}
                        {routeResult.product_name}
                      </p>

                      <p>
                        <span className="font-medium">
                          Available Stock:
                        </span>{" "}
                        {routeResult.quantity}
                      </p>

                    </div>

                  </div>

                )}

              </div>

            </div>

          </>

        )}

        {/* ORDERS - ADMIN ONLY */}

        {activePage === "Orders" && userRole === "admin" && (

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-xl font-semibold">
                  Orders
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Manage customer orders and delivery status.
                </p>

              </div>

              <span className="rounded-lg bg-slate-100 px-4 py-2 text-sm">
                {orders.length} orders
              </span>

            </div>

            {loadingOrders ? (

              <p className="mt-6 text-slate-500">
                Loading orders...
              </p>

            ) : orders.length === 0 ? (

              <p className="mt-6 text-slate-500">
                No orders found.
              </p>

            ) : (

              <div className="mt-6 overflow-x-auto">

                <table className="w-full text-left">

                  <thead>

                    <tr className="border-b border-slate-200 text-sm text-slate-500">

                      <th className="px-4 py-3">
                        ID
                      </th>

                      <th className="px-4 py-3">
                        Customer
                      </th>

                      <th className="px-4 py-3">
                        Product
                      </th>

                      <th className="px-4 py-3">
                        Qty
                      </th>

                      <th className="px-4 py-3">
                        Warehouse
                      </th>

                      <th className="px-4 py-3">
                        Destination
                      </th>

                      <th className="px-4 py-3">
                        Status
                      </th>

                      <th className="px-4 py-3">
                        Update
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {orders.map((order) => (

                      <tr
                        key={order.id}
                        className="border-b border-slate-100"
                      >

                        <td className="px-4 py-4">
                          #{order.id}
                        </td>

                        <td className="px-4 py-4">
                          {order.user_name}
                        </td>

                        <td className="px-4 py-4">
                          {order.product_name}
                        </td>

                        <td className="px-4 py-4">
                          {order.quantity}
                        </td>

                        <td className="px-4 py-4">
                          {order.warehouse_name || "Not assigned"}
                        </td>

                        <td className="px-4 py-4">
                          {order.destination}
                        </td>

                        <td className="px-4 py-4">

                          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                            {order.status}
                          </span>

                        </td>

                        <td className="px-4 py-4">

                          <select
                            value={order.status}
                            onChange={(event) =>
                              updateOrderStatus(
                                order.id,
                                event.target.value
                              )
                            }
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                          >

                            <option value="pending">
                              Pending
                            </option>

                            <option value="processing">
                              Processing
                            </option>

                            <option value="shipped">
                              Shipped
                            </option>

                            <option value="delivered">
                              Delivered
                            </option>

                          </select>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        )}

        {/* INVENTORY - ADMIN ONLY */}

        {activePage === "Inventory" && userRole === "admin" && (

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-xl font-semibold">
                  Inventory
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  View available stock across warehouses.
                </p>

              </div>

              <span className="rounded-lg bg-slate-100 px-4 py-2 text-sm">
                {inventory.length} inventory records
              </span>

            </div>

            {loadingInventory ? (

              <p className="mt-6 text-slate-500">
                Loading inventory...
              </p>

            ) : inventory.length === 0 ? (

              <p className="mt-6 text-slate-500">
                No inventory found.
              </p>

            ) : (

              <div className="mt-6 overflow-x-auto">

                <table className="w-full text-left">

                  <thead>

                    <tr className="border-b border-slate-200 text-sm text-slate-500">

                      <th className="px-4 py-3">
                        ID
                      </th>

                      <th className="px-4 py-3">
                        Warehouse
                      </th>

                      <th className="px-4 py-3">
                        Product
                      </th>

                      <th className="px-4 py-3">
                        Quantity
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {inventory.map((item) => (

                      <tr
                        key={item.id}
                        className="border-b border-slate-100"
                      >

                        <td className="px-4 py-4">
                          #{item.id}
                        </td>

                        <td className="px-4 py-4">
                          {item.warehouse_name ||
                            item.warehouse_id}
                        </td>

                        <td className="px-4 py-4">
                          {item.product_name}
                        </td>

                        <td className="px-4 py-4">

                          <span
                            className={`font-semibold ${
                              item.quantity <= 5
                                ? "text-red-600"
                                : item.quantity <= 15
                                ? "text-yellow-600"
                                : "text-green-600"
                            }`}
                          >
                            {item.quantity}
                          </span>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        )}

        {/* WAREHOUSES */}

        {activePage === "Warehouses" && (

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <h3 className="text-2xl font-semibold">
              Warehouses
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Available warehouses in the system.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">

              {warehouses.map((warehouse) => (

                <div
                  key={warehouse.id}
                  className="rounded-lg border border-slate-200 p-5"
                >

                  <h4 className="font-semibold">
                    {warehouse.name}
                  </h4>

                  <p className="mt-2 text-sm text-slate-500">
                    {warehouse.location}
                  </p>

                </div>

              ))}

            </div>

          </div>

        )}

      </main>

    </div>
  );
}