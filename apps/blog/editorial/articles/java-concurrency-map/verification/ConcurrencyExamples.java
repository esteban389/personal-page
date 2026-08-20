package verification;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.Semaphore;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.IntStream;

public final class ConcurrencyExamples {
    record Dashboard(String profile, List<String> orders) {}
    record PersonalizedDashboard(
            String profile,
            List<String> orders,
            List<String> recommendations) {}

    private ConcurrencyExamples() {}

    static String loadProfile() {
        return "Ada";
    }

    static List<String> loadOrders() {
        return List.of("A-100", "A-101");
    }

    static CompletableFuture<List<String>> loadRecommendations(
            String profile, ExecutorService executor) {
        return CompletableFuture.supplyAsync(
                () -> List.of("Suggested for " + profile), executor);
    }

    static Dashboard loadDashboardWithFutures()
            throws InterruptedException, ExecutionException {
        try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
            Future<String> profile = executor.submit(ConcurrencyExamples::loadProfile);
            Future<List<String>> orders = executor.submit(ConcurrencyExamples::loadOrders);

            return new Dashboard(profile.get(), orders.get());
        }
    }

    static Dashboard loadDashboardWithImmediateGets()
            throws InterruptedException, ExecutionException {
        try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
            String profile = executor.submit(ConcurrencyExamples::loadProfile).get();
            List<String> orders = executor.submit(ConcurrencyExamples::loadOrders).get();

            return new Dashboard(profile, orders);
        }
    }

    static String loadProfileLabelWithPipeline() {
        try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
            CompletableFuture<String> profile =
                    CompletableFuture.supplyAsync(ConcurrencyExamples::loadProfile, executor);

            return profile.thenApply(name -> "Customer: " + name).join();
        }
    }

    static PersonalizedDashboard loadPersonalizedDashboardWithPipeline() {
        try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
            CompletableFuture<String> profile =
                    CompletableFuture.supplyAsync(ConcurrencyExamples::loadProfile, executor);
            CompletableFuture<List<String>> orders =
                    CompletableFuture.supplyAsync(ConcurrencyExamples::loadOrders, executor);

            CompletableFuture<List<String>> recommendations = profile.thenCompose(
                    loadedProfile -> loadRecommendations(loadedProfile, executor));

            CompletableFuture<Dashboard> dashboard =
                    profile.thenCombine(orders, Dashboard::new);

            return dashboard.thenCombine(
                            recommendations,
                            (loadedDashboard, loadedRecommendations) ->
                                    new PersonalizedDashboard(
                                            loadedDashboard.profile(),
                                            loadedDashboard.orders(),
                                            loadedRecommendations))
                    .join();
        }
    }

    static int countCompletedTasks() throws InterruptedException, ExecutionException {
        AtomicInteger completed = new AtomicInteger();

        try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
            List<Future<Integer>> tasks = IntStream.range(0, 100)
                    .mapToObj(ignored -> executor.submit(completed::incrementAndGet))
                    .toList();

            for (Future<Integer> task : tasks) {
                task.get();
            }
        }

        return completed.get();
    }

    static String fetchWithLimit(Semaphore permits, String requestId)
            throws InterruptedException {
        permits.acquire();
        try {
            return "response-for-" + requestId;
        } finally {
            permits.release();
        }
    }

    static long sumSquaresInParallel(List<Integer> values) {
        return values.parallelStream()
                .mapToLong(value -> (long) value * value)
                .sum();
    }

    static final class DashboardPublication {
        private Dashboard publishedDashboard;
        private volatile boolean dashboardReady;

        void publish(Dashboard value) {
            publishedDashboard = value;
            dashboardReady = true;
        }

        Dashboard readIfReady() {
            return dashboardReady ? publishedDashboard : null;
        }
    }

    public static void main(String[] args) throws Exception {
        assert loadDashboardWithFutures()
                .equals(new Dashboard("Ada", List.of("A-100", "A-101")));
        assert loadDashboardWithImmediateGets()
                .equals(new Dashboard("Ada", List.of("A-100", "A-101")));
        assert loadProfileLabelWithPipeline().equals("Customer: Ada");
        assert loadPersonalizedDashboardWithPipeline()
                .equals(new PersonalizedDashboard(
                        "Ada",
                        List.of("A-100", "A-101"),
                        List.of("Suggested for Ada")));
        assert countCompletedTasks() == 100;

        Semaphore permits = new Semaphore(2);
        assert fetchWithLimit(permits, "42").equals("response-for-42");
        assert permits.availablePermits() == 2;

        assert sumSquaresInParallel(List.of(1, 2, 3, 4)) == 30;

        DashboardPublication publication = new DashboardPublication();
        Dashboard expectedDashboard = new Dashboard("Ada", List.of("A-100", "A-101"));
        Thread publisher = Thread.startVirtualThread(() -> publication.publish(expectedDashboard));
        Dashboard visibleDashboard;
        do {
            visibleDashboard = publication.readIfReady();
            if (visibleDashboard == null) {
                Thread.onSpinWait();
            }
        } while (visibleDashboard == null);
        assert visibleDashboard.equals(expectedDashboard);
        publisher.join();

        System.out.println("All concurrency examples passed.");
    }
}
