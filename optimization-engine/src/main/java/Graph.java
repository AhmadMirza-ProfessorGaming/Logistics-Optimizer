import java.util.*;

public class Graph {

    private Map<String, List<Edge>> graph = new HashMap<>();

    public void addWarehouse(String warehouse) {
        graph.putIfAbsent(warehouse, new ArrayList<>());
    }

    public void addConnection(String from, String to, int distance) {
        graph.get(from).add(new Edge(to, distance));
    }

    public Map<String, List<Edge>> getGraph() {
        return graph;
    }
}