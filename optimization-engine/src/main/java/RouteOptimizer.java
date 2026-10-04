import java.util.*;

public class RouteOptimizer {

    public static void main(String[] args) {

        // Create the logistics network
        Graph graph = new Graph();

        graph.addWarehouse("Dublin");
        graph.addWarehouse("Cork");
        graph.addWarehouse("Galway");

        graph.addConnection("Dublin", "Cork", 200);
        graph.addConnection("Dublin", "Galway", 500);
        graph.addConnection("Cork", "Galway", 190);


        // Create warehouses
        List<Warehouse> warehouses = new ArrayList<>();

        warehouses.add(
                new Warehouse("Dublin Warehouse", "Dublin")
        );

        warehouses.add(
                new Warehouse("Cork Warehouse", "Cork")
        );

        warehouses.add(
                new Warehouse("Galway Warehouse", "Galway")
        );


        // Create inventory
        Inventory inventory = new Inventory();

        inventory.addStock("Dublin", "Laptop", 20);
        inventory.addStock("Cork", "Laptop", 10);
        inventory.addStock("Galway", "Laptop", 5);


        // Customer request
        String product = "Laptop";
        int quantity = 10;
        String destination = "Galway";


        // Find best warehouse
        Warehouse bestWarehouse =
                WarehouseInventorySelector.selectWarehouse(
                        graph,
                        warehouses,
                        inventory,
                        product,
                        quantity,
                        destination
                );
String warehouseLocation = bestWarehouse.getLocation();;

List<String> route =
        WarehouseInventorySelector.getBestRoute(
                graph,
                warehouseLocation,
                destination
        );


        System.out.println(
                "Product: " + product
        );

        System.out.println(
                "Quantity: " + quantity
        );

        System.out.println(
                "Destination: " + destination
        );

        System.out.println(
                "Best warehouse: " + bestWarehouse
        );
        System.out.println(
        "Optimal route: "
                + String.join(" -> ", route)
);

Map<String, Integer> distances =
        Dijkstra.shortestPath(
                graph,
                warehouseLocation
        );

System.out.println(
        "Distance: "
                + distances.get(destination)
                + " km"
);
    }
}