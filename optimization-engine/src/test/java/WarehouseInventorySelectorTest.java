import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class WarehouseInventorySelectorTest {

    @Test
    public void testSelectBestWarehouse() {

        Graph graph = new Graph();

        graph.addWarehouse("Dublin");
        graph.addWarehouse("Cork");
        graph.addWarehouse("Galway");

        graph.addConnection("Dublin", "Cork", 200);
        graph.addConnection("Dublin", "Galway", 500);
        graph.addConnection("Cork", "Galway", 190);


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


        Inventory inventory = new Inventory();

        inventory.addStock("Dublin", "Laptop", 20);
        inventory.addStock("Cork", "Laptop", 10);
        inventory.addStock("Galway", "Laptop", 5);


        Warehouse selected =
                WarehouseInventorySelector.selectWarehouse(
                        graph,
                        warehouses,
                        inventory,
                        "Laptop",
                        10,
                        "Galway"
                );


        assertEquals(
                "Cork Warehouse",
                selected.getName()
        );
    }
}