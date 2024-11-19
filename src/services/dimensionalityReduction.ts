
import { mean, matrix, multiply, transpose, eigs, Matrix} from 'mathjs';

function pcaReduction(points: number[][]): [number, number, number][] {
  // Center the data
  const means = points[0].map((_, colIndex) => 
    mean(points.map(row => row[colIndex]))
  );
  
  const centered = points.map(row =>
    row.map((val, colIndex) => val - means[colIndex])
  );
  
  // Calculate covariance matrix
  const covMatrix = matrix(centered);
  const transCovMatrix = transpose(covMatrix);
  const covariance = multiply(transCovMatrix, covMatrix);
  
  // Get eigenvectors
  const { eigenvectors } = eigs(covariance);
  
  // Convert eigenvectors to number arrays and take top 3
  const principalComponents = eigenvectors
    .slice(0, 3)
    .map(e => {
      const vector = e.vector as Matrix;
      return Array.isArray(vector) ? vector : (vector as Matrix).toArray() as number[];
    });
  
  // Create matrix from principal components
  const pcaMatrix = matrix(principalComponents.map(vec => 
    Array.isArray(vec) ? vec : [vec]
  ));
  
  // Project data onto first 3 principal components
  const projection = multiply(covMatrix, transpose(pcaMatrix));
  
  // Convert to array and normalize
  const projArray = (Array.isArray(projection) ? projection : projection.toArray()) as number[][];
  
  // Normalize the results
  const normalize = (arr: number[]): number[] => {
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    return arr.map(x => (x - min) / (max - min) * 2 - 1);
  };

  const x = normalize(projArray.map(p => p[0]));
  const y = normalize(projArray.map(p => p[1]));
  const z = normalize(projArray.map(p => p[2]));

  return projArray.map((_, i): [number, number, number] => [x[i], y[i], z[i]]);
}

// UMAP-inspired implementation with better neighbor preservation
function umapReduction(points: number[][]): [number, number, number][] {
  const computeNeighborhoods = (data: number[][], k: number = 15) => {
    return data.map(point => {
      const distances = data.map(other => 
        Math.sqrt(point.reduce((sum, val, i) => 
          sum + Math.pow(val - other[i], 2), 0))
      );
      return distances
        .map((d, i) => ({ distance: d, index: i }))
        .sort((a, b) => a.distance - b.distance)
        .slice(1, k + 1);
    });
  };

  const neighborhoods = computeNeighborhoods(points);
  
  // Compute low-dimensional coordinates using force-directed layout
  const positions: [number, number, number][] = points.map(() => [
    Math.random() * 2 - 1,
    Math.random() * 2 - 1,
    Math.random() * 2 - 1
  ]);

  // Optimize positions using gradient descent
  const iterations = 100;
  const learningRate = 0.1;

  for (let iter = 0; iter < iterations; iter++) {
    const force = positions.map(() => [0, 0, 0]);
    
    // Attractive forces between neighbors
    neighborhoods.forEach((neighbors, i) => {
      neighbors.forEach(({ index: j }) => {
        const dx = positions[j][0] - positions[i][0];
        const dy = positions[j][1] - positions[i][1];
        const dz = positions[j][2] - positions[i][2];
        
        const magnitude = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (magnitude > 0) {
          force[i][0] += (dx / magnitude) * learningRate;
          force[i][1] += (dy / magnitude) * learningRate;
          force[i][2] += (dz / magnitude) * learningRate;
        }
      });
    });

    // Apply forces
    positions.forEach((pos, i) => {
      pos[0] += force[i][0];
      pos[1] += force[i][1];
      pos[2] += force[i][2];
    });
  }

  // Normalize the results
  const normalize = (arr: number[]): number[] => {
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    return (arr.map(x => (x - min) / (max - min)));
  };

  const x = normalize(positions.map(p => p[0]));
  const y = normalize(positions.map(p => p[1]));
  const z = normalize(positions.map(p => p[2]));

  return positions.map((_, i) => [x[i], y[i], z[i]]);
}

// t-SNE implementation with momentum and early exaggeration
function tsneReduction(points: number[][]): [number, number, number][] {
  const computeHighDimSimilarities = (data: number[][], perplexity: number = 30) => {
    const similarities: number[][] = Array(data.length).fill(0)
      .map(() => Array(data.length).fill(0));
    
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data.length; j++) {
        if (i !== j) {
          const dist = Math.sqrt(data[i].reduce((sum, val, k) => 
            sum + Math.pow(val - data[j][k], 2), 0));
          similarities[i][j] = Math.exp(-dist * dist / (2 * perplexity));
        }
      }
      
      // Normalize probabilities
      const sum = similarities[i].reduce((a, b) => a + b, 0);
      similarities[i] = similarities[i].map(s => s / sum);
    }
    
    return similarities;
  };

  const highDimSimilarities = computeHighDimSimilarities(points);
  
  // Initialize low-dimensional points
  const positions: [number, number, number][] = points.map(() => [
    Math.random() * 0.0001,
    Math.random() * 0.0001,
    Math.random() * 0.0001
  ]);

  const iterations = 1000;
  const learningRate = 100;
  const momentum = 0.8;
  const earlyExaggeration = 4.0;
  
  const velocities: [number, number, number][] = 
    points.map(() => [0, 0, 0]);

  for (let iter = 0; iter < iterations; iter++) {
    // Compute low-dimensional similarities
    const lowDimSimilarities: number[][] = Array(points.length).fill(0)
      .map(() => Array(points.length).fill(0));
    
    for (let i = 0; i < points.length; i++) {
      for (let j = 0; j < points.length; j++) {
        if (i !== j) {
          const dist = Math.sqrt(
            Math.pow(positions[i][0] - positions[j][0], 2) +
            Math.pow(positions[i][1] - positions[j][1], 2) +
            Math.pow(positions[i][2] - positions[j][2], 2)
          );
          lowDimSimilarities[i][j] = 1 / (1 + dist * dist);
        }
      }
    }

    // Compute gradients
    const gradients: [number, number, number][] = 
      points.map(() => [0, 0, 0]);
    
    for (let i = 0; i < points.length; i++) {
      for (let j = 0; j < points.length; j++) {
        if (i !== j) {
          const factor = 4 * (
            highDimSimilarities[i][j] * (iter < 100 ? earlyExaggeration : 1) -
            lowDimSimilarities[i][j]
          ) * lowDimSimilarities[i][j];
          
          gradients[i][0] += factor * (positions[i][0] - positions[j][0]);
          gradients[i][1] += factor * (positions[i][1] - positions[j][1]);
          gradients[i][2] += factor * (positions[i][2] - positions[j][2]);
        }
      }
    }

    // Update positions using momentum
    for (let i = 0; i < points.length; i++) {
      velocities[i][0] = momentum * velocities[i][0] - learningRate * gradients[i][0];
      velocities[i][1] = momentum * velocities[i][1] - learningRate * gradients[i][1];
      velocities[i][2] = momentum * velocities[i][2] - learningRate * gradients[i][2];
      
      positions[i][0] += velocities[i][0];
      positions[i][1] += velocities[i][1];
      positions[i][2] += velocities[i][2];
    }
  }

  // Normalize final positions
  const normalize = (arr: number[]): number[] => {
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    return arr.map(x => (x - min) / (max - min) * 2 - 1);
  };

  const x = normalize(positions.map(p => p[0]));
  const y = normalize(positions.map(p => p[1]));
  const z = normalize(positions.map(p => p[2]));

  return positions.map((_, i) => [x[i], y[i], z[i]]);
}

export const reductionMethods = {
  pca: pcaReduction,
  umap: umapReduction,
  tsne: tsneReduction
};