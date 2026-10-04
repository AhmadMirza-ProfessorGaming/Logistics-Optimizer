import java.util.*;

public class Inventory {

    private Map<String, Map<String, Integer>> stock =
            new HashMap<>();

    public void addStock(
            String warehouse,
            String product,
            int quantity) {

        stock
            .computeIfAbsent(
                warehouse,
                key -> new HashMap<>()
            )
            .put(product, quantity);
    }

    public boolean hasEnough(
            String warehouse,
            String product,
            int requiredQuantity) {

        if (!stock.containsKey(warehouse)) {
            return false;
        }

        int available =
                stock.get(warehouse)
                     .getOrDefault(product, 0);

        return available >= requiredQuantity;
    }

    public int getQuantity(
            String warehouse,
            String product) {

        if (!stock.containsKey(warehouse)) {
            return 0;
        }

        return stock.get(warehouse)
                    .getOrDefault(product, 0);
    }
}