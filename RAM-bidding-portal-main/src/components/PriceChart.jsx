import { motion } from 'framer-motion'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { LineChart as LineChartIcon } from 'lucide-react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function PriceChart({ data }) {
  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map((ds) => ({
      label: ds.hotel,
      data: ds.data,
      borderColor: ds.color,
      backgroundColor: ds.color + '15',
      borderWidth: ds.hotel.includes('vous') ? 3 : 2,
      tension: 0.35,
      fill: ds.hotel.includes('vous'),
      pointRadius: ds.hotel.includes('vous') ? 4 : 2,
      pointHoverRadius: 6,
      pointBackgroundColor: ds.color,
    })),
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 10,
          padding: 16,
          font: { size: 11, family: 'Inter' },
          color: '#6B7280',
        },
      },
      tooltip: {
        backgroundColor: '#1A1A1A',
        titleColor: '#C9A86A',
        bodyColor: '#FFFFFF',
        borderColor: '#C9A86A',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y} MAD`,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (v) => v + ' MAD',
          color: '#9CA3AF',
          font: { size: 10 },
        },
        grid: { color: '#F1F1F1' },
      },
      x: {
        ticks: { color: '#9CA3AF', font: { size: 10 } },
        grid: { display: false },
      },
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="card-premium p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-ram-primary/10 text-ram-primary flex items-center justify-center">
          <LineChartIcon size={18} />
        </div>
        <div>
          <h2 className="font-display font-semibold text-base text-ram-secondary">
            Évolution des prix · 14 derniers jours
          </h2>
          <p className="text-xs text-ink-muted mt-0.5">
            Comparatif avec les hôtels de votre catégorie
          </p>
        </div>
      </div>

      <div className="h-80">
        <Line data={chartData} options={options} />
      </div>
    </motion.div>
  )
}
