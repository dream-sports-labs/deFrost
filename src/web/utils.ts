export const colors = {
  misc: {
    backgroundColor: 'rgb(10, 99, 132, 0.5)',
    borderColor: 'rgb(10, 99, 132, 1)',
  },
  input: {
    backgroundColor: 'rgb(54, 162, 235, 0.5)',
    borderColor: 'rgb(54, 162, 235, 1)',
  },
  animations: {
    backgroundColor: 'rgb(255, 20, 86, 0.5)',
    borderColor: 'rgb(255, 20, 86, 1)',
  },
  measure: {
    backgroundColor: 'rgb(75, 192, 192, 0.5)',
    borderColor: 'rgb(75, 192, 192,1)',
  },
  draw: {
    backgroundColor: 'rgb(153, 102, 255, 0.5)',
    borderColor: 'rgb(153, 102, 255, 1)',
  },
  sync: {
    backgroundColor: 'rgb(255, 225, 64, 0.5)',
    borderColor: 'rgb(255, 225, 64, 1)',
  },
  gpu: {
    backgroundColor: 'rgb(122, 99, 71, 0.5)',
    borderColor: 'rgb(122, 99, 71, 1)',
  },
};

export const options = (
  handleOnClick: (event: React.MouseEvent, elements: any[]) => void
) => ({
  responsive: true,
  onClick: handleOnClick,
  plugins: {
    annotation: {
      annotations: {
        line1: {
          type: 'line',
          yMin: 16,
          yMax: 16,
          borderColor: 'green',
          borderWidth: 1,
          label: {
            content: 'Line at 16',
            enabled: true,
            position: 'left',
            backgroundColor: 'green',
            color: 'white',
          },
        },
        line2: {
          type: 'line',
          yMin: 700,
          yMax: 700,
          borderColor: 'red',
          borderWidth: 1,
          borderDash: [5, 5],
          label: {
            content: 'Line at 700',
            enabled: true,
            position: 'left',
            backgroundColor: 'red',
            color: 'white',
          },
        },
      },
    },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          const label = context.dataset.label || '';
          const point = context.raw;
          if (label === 'React') {
            return `componentName : ${point.label}`;
          }
          if (label === 'Log') {
            return `Log: ${point.label}`;
          }
          return `${label}: ${point}`;
        },
      },
    },

    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart',
    },
    zoom: {
      zoom: {
        limits: {
          y: { min: 0, max: 20, minRange: 'original' },
        },
        drag: {
          enabled: true,
        },
      },
    },
  },
  scales: {
    x: {
      stacked: true,
      min: 0,
    },
    y: {
      stacked: true,
      min: 0,
    },
  },
});

export const removeDefrost = (componentName?: string) => {
  if (componentName?.includes('Defrost')) {
    const newName = componentName.split('Defrost')[0];
    return `memo(${newName})`;
  } else {
    return componentName;
  }
};

export type ListEvent = {
  flags: number | null;
  key: string | null;
  componentName?: string;
};

export const removeDefrostFromList = (list?: ListEvent[]) => {
  const res: ListEvent[] = [];
  list?.forEach((item) => {
    res.push({ ...item, componentName: removeDefrost(item.componentName) });
  });
  return res;
};

export type CsvDataType = {
  animations: string;
  draw: string;
  gpu: string;
  input: string;
  measure: string;
  misc: string;
  sync: string;
  timestamp: string;
};

export type ReactEventType = {
  timestamp: string;
  event: {
    change?: {
      name: string | null;
      key: string | null;
    };
    list?: ListEvent[];
  };
};

export type ReactItemType = {
  x: string;
  y: number;
  label: string;
  data: ListEvent[];
};

export type LogItem = {
  x: string;
  y: number;
  label: string;
  data: string;
};
export type LogEvent = {
  timestamp: string;
  event: string;
};

export type ModalDataType = { label?: string; data?: ListEvent[] };
