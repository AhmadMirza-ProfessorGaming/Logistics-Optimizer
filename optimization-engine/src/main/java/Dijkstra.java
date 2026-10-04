import java.util.*;

public class Dijkstra {

    public static Map<String, Integer> shortestPath(
            Graph graph,
            String start) {

        Map<String, Integer> distances = new HashMap<>();
        Map<String, String> previous = new HashMap<>();

        for (String warehouse : graph.getGraph().keySet()) {
            distances.put(warehouse, Integer.MAX_VALUE);
        }

        distances.put(start, 0);

        PriorityQueue<String> queue =
                new PriorityQueue<>(
                        Comparator.comparingInt(distances::get)
                );

        queue.add(start);

        while (!queue.isEmpty()) {

            String current = queue.poll();

            for (Edge edge : graph.getGraph().get(current)) {

                int newDistance =
                        distances.get(current) + edge.distance;

                if (newDistance < distances.get(edge.destination)) {

                    distances.put(edge.destination, newDistance);

                    previous.put(edge.destination, current);

                    queue.add(edge.destination);
                }
            }
        }

        return distances;
    }

    public static List<String> getRoute(
            Graph graph,
            String start,
            String destination) {

        Map<String, Integer> distances = new HashMap<>();
        Map<String, String> previous = new HashMap<>();

        for (String warehouse : graph.getGraph().keySet()) {
            distances.put(warehouse, Integer.MAX_VALUE);
        }

        distances.put(start, 0);

        PriorityQueue<String> queue =
                new PriorityQueue<>(
                        Comparator.comparingInt(distances::get)
                );

        queue.add(start);

        while (!queue.isEmpty()) {

            String current = queue.poll();

            for (Edge edge : graph.getGraph().get(current)) {

                int newDistance =
                        distances.get(current) + edge.distance;

                if (newDistance < distances.get(edge.destination)) {

                    distances.put(edge.destination, newDistance);

                    previous.put(edge.destination, current);

                    queue.add(edge.destination);
                }
            }
        }

        List<String> route = new ArrayList<>();

        String current = destination;

        while (current != null) {
            route.add(current);
            current = previous.get(current);
        }

        Collections.reverse(route);

        return route;
    }
}