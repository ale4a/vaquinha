import React, { useMemo } from 'react';
import { Chart, AxisOptions } from 'react-charts';

// Define el tipo para tus datos
type DataPoint = { x: number; y: number };

// Define el tipo para las series de datos
type Series = {
  label: string;
  data: DataPoint[];
};

const HowItWorks: React.FC = () => {
  const data: Series[] = useMemo(
    () => [
      {
        label: 'Vaquita',
        data: [
          { x: 1, y: 5 },
          { x: 2, y: 10 },
          { x: 3, y: 15 },
          { x: 4, y: 20 },
          { x: 5, y: 18 },
          { x: 6, y: 16 },
        ],
      },
      {
        label: 'AAVE',
        data: [
          { x: 1, y: 5 },
          { x: 2, y: 8 },
          { x: 3, y: 12 },
          { x: 4, y: 14 },
          { x: 5, y: 14 },
          { x: 6, y: 14 },
        ],
      },
    ],
    []
  );

  // Define el eje X
  const primaryAxis = useMemo<AxisOptions<DataPoint>>(
    () => ({
      getValue: (datum) => datum.x,
    }),
    []
  );

  // Define el/los ejes Y (en plural)
  const secondaryAxes = useMemo<AxisOptions<DataPoint>[]>(
    () => [
      {
        getValue: (datum) => datum.y,
      },
    ],
    []
  );

  return (
    <section className="mt-12 text-center">
      <h2 className="text-2xl font-bold mb-6">How It Works</h2>
      <div className="flex flex-col items-center md:flex-row justify-center gap-8">
        <InterestGraph
          title="Pay Later? Less Interest"
          data={data}
          primaryAxis={primaryAxis}
          secondaryAxes={secondaryAxes}
        />
        <InterestGraph
          title="Didn't Pay? Lost Interest"
          data={data}
          primaryAxis={primaryAxis}
          secondaryAxes={secondaryAxes}
        />
        <InterestGraph
          title="Pay Earlier? More Interest"
          data={data}
          primaryAxis={primaryAxis}
          secondaryAxes={secondaryAxes}
        />
      </div>
    </section>
  );
};

// Tipos para las propiedades de InterestGraph
type InterestGraphProps = {
  title: string;
  data: Series[];
  primaryAxis: AxisOptions<DataPoint>;
  secondaryAxes: AxisOptions<DataPoint>[];
};

const InterestGraph: React.FC<InterestGraphProps> = ({
  title,
  data,
  primaryAxis,
  secondaryAxes,
}) => {
  return (
    <div className="text-center">
      <p>
        <strong>{title}</strong>
      </p>
      <div style={{ width: '300px', height: '200px' }}>
        <Chart
          options={{
            data,
            primaryAxis,
            secondaryAxes, // Aquí usamos secondaryAxes en plural, ya que acepta múltiples ejes Y
          }}
        />
      </div>
    </div>
  );
};

export default HowItWorks;
