type HealthData = {
  status: string;
  service: string;
};

async function getHealthData(): Promise<HealthData> {
  const response = await fetch("https://httpbin.org/json", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch health data");
  }

  return {
    status: "healthy",
    service: "AI Internship Capstone",
  };
}

export default async function HealthPage() {
  const health = await getHealthData();

  return (
    <main>
      <h1>Health Check</h1>
      <p>This page verifies that the application can fetch server-side data.</p>

      <div>
        <p>
          <strong>Status:</strong> {health.status}
        </p>
        <p>
          <strong>Service:</strong> {health.service}
        </p>
      </div>
    </main>
  );
}