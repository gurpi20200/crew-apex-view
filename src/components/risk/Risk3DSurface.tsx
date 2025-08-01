import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import * as THREE from 'three';

interface CorrelationData {
  symbol1: string;
  symbol2: string;
  correlation: number;
}

interface Risk3DSurfaceProps {
  correlationData: CorrelationData[];
  symbols: string[];
}

const CorrelationSurface = ({ correlationData, symbols }: Risk3DSurfaceProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const { geometry, positions } = useMemo(() => {
    const size = symbols.length;
    const geometry = new THREE.PlaneGeometry(size, size, size - 1, size - 1);
    const positions = geometry.attributes.position;
    
    // Create correlation matrix
    const correlationMatrix: number[][] = Array(size).fill(0).map(() => Array(size).fill(0));
    
    correlationData.forEach(({ symbol1, symbol2, correlation }) => {
      const i = symbols.indexOf(symbol1);
      const j = symbols.indexOf(symbol2);
      if (i !== -1 && j !== -1) {
        correlationMatrix[i][j] = correlation;
        correlationMatrix[j][i] = correlation;
      }
    });
    
    // Apply correlation values as height
    for (let i = 0; i < positions.count; i++) {
      const x = Math.floor(i / size);
      const y = i % size;
      const correlation = correlationMatrix[x]?.[y] || 0;
      positions.setZ(i, correlation * 2);
    }
    
    geometry.computeVertexNormals();
    return { geometry, positions };
  }, [correlationData, symbols]);

  const colorArray = useMemo(() => {
    const colors = new Float32Array(positions.count * 3);
    for (let i = 0; i < positions.count; i++) {
      const z = positions.getZ(i);
      const normalizedCorr = (z / 2 + 1) / 2; // Normalize from [-1,1] to [0,1]
      
      // Color gradient: red (negative) -> yellow (neutral) -> green (positive)
      if (normalizedCorr < 0.5) {
        colors[i * 3] = 1; // Red
        colors[i * 3 + 1] = normalizedCorr * 2; // Green
        colors[i * 3 + 2] = 0; // Blue
      } else {
        colors[i * 3] = 2 - normalizedCorr * 2; // Red
        colors[i * 3 + 1] = 1; // Green
        colors[i * 3 + 2] = 0; // Blue
      }
    }
    return colors;
  }, [positions]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <>
      <mesh ref={meshRef} geometry={geometry}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-color"
            array={colorArray}
            count={positions.count}
            itemSize={3}
          />
        </bufferGeometry>
        <meshPhongMaterial vertexColors wireframe={false} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Symbol labels */}
      {symbols.map((symbol, index) => (
        <Text
          key={symbol}
          position={[index - symbols.length / 2, -symbols.length / 2 - 1, 0]}
          fontSize={0.3}
          color="hsl(var(--foreground))"
          anchorX="center"
          anchorY="middle"
        >
          {symbol}
        </Text>
      ))}
      
      {symbols.map((symbol, index) => (
        <Text
          key={`y-${symbol}`}
          position={[-symbols.length / 2 - 1, index - symbols.length / 2, 0]}
          fontSize={0.3}
          color="hsl(var(--foreground))"
          anchorX="center"
          anchorY="middle"
          rotation={[0, 0, Math.PI / 2]}
        >
          {symbol}
        </Text>
      ))}
    </>
  );
};

export const Risk3DSurface = ({ correlationData, symbols }: Risk3DSurfaceProps) => {
  return (
    <Card className="w-full h-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            3D Correlation Surface
            <Badge variant="secondary" className="text-xs">Interactive</Badge>
          </div>
          <div className="text-sm text-muted-foreground font-normal">
            Drag to rotate • Scroll to zoom • Click symbols for details
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[500px]">
        <Suspense fallback={<Skeleton className="w-full h-full" />}>
          <Canvas camera={{ position: [8, 8, 8], fov: 60 }}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[-10, -10, -5]} intensity={0.5} />
            
            <CorrelationSurface 
              correlationData={correlationData} 
              symbols={symbols} 
            />
            
            <OrbitControls 
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={5}
              maxDistance={20}
            />
          </Canvas>
        </Suspense>
      </CardContent>
    </Card>
  );
};