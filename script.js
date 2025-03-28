function kMeans(data, k, maxIterations = 100) {
        const centroids = data.slice(0, k);

        let clusters = [];
        let converged = false;
        let iterations = 0;

        while (!converged && iterations < maxIterations) {
          clusters = Array.from({ length: k }, () => []);

          data.forEach((point) => {
            let minDist = Infinity;
            let clusterIndex = -1;

            centroids.forEach((centroid, i) => {
              const distance = Math.sqrt(
                Math.pow(point.x - centroid.x, 2) +
                  Math.pow(point.y - centroid.y, 2)
              );

              if (distance < minDist) {
                minDist = distance;
                clusterIndex = i;
              }
            });

            clusters[clusterIndex].push(point);
          });

          const newCentroids = centroids.map((_, i) => {
            const cluster = clusters[i];
            const avgX =
              cluster.reduce((sum, point) => sum + point.x, 0) /
                cluster.length || 0;
            const avgY =
              cluster.reduce((sum, point) => sum + point.y, 0) /
                cluster.length || 0;
            return { x: avgX, y: avgY };
          });

          converged = newCentroids.every(
            (centroid, i) =>
              centroid.x === centroids[i].x && centroid.y === centroids[i].y
          );

          centroids.forEach((centroid, i) => {
            centroid.x = newCentroids[i].x;
            centroid.y = newCentroids[i].y;
          });

          iterations++;
        }

        return { clusters, centroids };
      }

      function drawClusters(clusters, centroids, k) {
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        clusters.forEach((cluster, index) => {
          ctx.fillStyle = `hsl(${(360 / k) * index}, 100%, 50%)`;
          cluster.forEach((point) => {
            ctx.beginPath();
            ctx.arc(point.x * 40, point.y * 40, 5, 0, Math.PI * 2);
            ctx.fill();
          });
        });

        centroids.forEach((centroid, index) => {
          ctx.fillStyle = "black";
          ctx.beginPath();
          ctx.arc(centroid.x * 40, centroid.y * 40, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillText(
            `C${index + 1}`,
            centroid.x * 40 + 10,
            centroid.y * 40 - 10
          );
        });
      }

      function runKMeans() {
        try {
          const k = parseInt(document.getElementById("kValue").value);
          const data = JSON.parse(document.getElementById("dataInput").value);

          const result = kMeans(data, k);
          drawClusters(result.clusters, result.centroids, k);
        } catch (error) {
          alert(
            "Invalid input: Please ensure the dataset is in correct JSON format."
          );
        }
      }

      // Initial run with default k=3
      runKMeans();
