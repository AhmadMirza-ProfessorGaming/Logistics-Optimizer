import org.junit.Test;

import java.util.Map;

import static org.junit.Assert.assertEquals;

public class DijkstraTest {

    @Test
    public void testShortestPath() {

        Graph graph = new Graph();

        graph.addWarehouse("Dublin");
        graph.addWarehouse("Cork");
        graph.addWarehouse("Galway");

        graph.addConnection("Dublin", "Cork", 200);
        graph.addConnection("Dublin", "Galway", 500);
        graph.addConnection("Cork", "Galway", 190);

        Map<String, Integer> distances =
                Dijkstra.shortestPath(graph, "Dublin");

        assertEquals(
                Integer.valueOf(390),
                distances.get("Galway")
        );
    }
}