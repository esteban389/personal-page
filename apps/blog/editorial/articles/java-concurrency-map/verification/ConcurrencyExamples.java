package verification;

import java.time.Instant;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.Semaphore;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.logging.Logger;
import java.util.stream.IntStream;
import verification.ImportExample;

public final class ConcurrencyExamples {
    private final static Logger logger = Logger.getLogger(ConcurrencyExamples.class.getName());
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
        logger.info("Loading dashboard with futures...");
        try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
            Instant start = Instant.now();
            logger.info("Submitting tasks... " + start);
            Future<String> profile = executor.submit(ConcurrencyExamples::loadProfile);
            Future<List<String>> orders = executor.submit(ConcurrencyExamples::loadOrders);

            logger.info("Waiting for results...");
            return new Dashboard(profile.get(), orders.get());
        }
    }

    static Dashboard loadDashboardWithPipeline() {
        logger.info("Loading dashboard with pipeline...");
        try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
            Instant start = Instant.now();
            logger.info("Submitting tasks... " + start);
            CompletableFuture<String> profile =
                    CompletableFuture.supplyAsync(ConcurrencyExamples::loadProfile, executor);
            CompletableFuture<List<String>> orders =
                    CompletableFuture.supplyAsync(ConcurrencyExamples::loadOrders, executor);

            var result = profile.thenCombine(orders, Dashboard::new).join();
            logger.info("Dashboard loaded in " + Instant.now().minusMillis(start.toEpochMilli()));
            return result;
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

    public static void main(String[] args) throws Exception {
        assert loadDashboardWithFutures()
                .equals(new Dashboard("Ada", List.of("A-100", "A-101")));
        assert loadDashboardWithPipeline()
                .equals(new Dashboard("Ada", List.of("A-100", "A-101")));
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
        new ImportExample().hello();
        System.out.println("All concurrency examples passed.");
    }
}
