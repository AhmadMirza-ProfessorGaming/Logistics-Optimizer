import java.util.*;

public class WarehouseInventorySelector {

    public static Warehouse selectWarehouse(
            Graph graph,
            List<Warehouse> warehouses,
            Inventory inventory,
            String product,
            int quantity,
            String destination) {

        Warehouse bestWarehouse = null;
        int shortestDistance = Integer.MAX_VALUE;

        for (Warehouse warehouse : warehouses) {

            String location = warehouse.getLocation();

            if (!inventory.hasEnough(
                    location,
                    product,
                    quantity)) {
                continue;
            }

            Map<String, Integer> distances =
                    Dijkstra.shortestPath(
                            graph,
                            location
                    );

            int distance = distances.get(destination);

            if (distance < shortestDistance) {
                shortestDistance = distance;
                bestWarehouse = warehouse;
            }
        }

        return bestWarehouse;
    }

    public static List<String> getBestRoute(
            Graph graph,
            String warehouseLocation,
            String destination) {

        return Dijkstra.getRoute(
                graph,
                warehouseLocation,
                destination
        );
    }
}