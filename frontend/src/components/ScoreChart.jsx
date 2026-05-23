import React from 'react';
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { FiTrendingUp } from 'react-icons/fi';
import EmptyState from './ui/EmptyState.jsx';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

function ScoreChart({ scoreHistory }) {
  const chartScores = [...scoreHistory].reverse();

  if (chartScores.length === 0) {
    return (
      <div className="panel">
        <EmptyState
          icon={<FiTrendingUp />}
          title="Score Chart"
          message="No quiz scores yet. Complete a quiz to see your progress chart."
        />
      </div>
    );
  }

  const data = {
    labels: chartScores.map((item) => item.topicTitle),
    datasets: [
      {
        label: 'Score',
        data: chartScores.map((item) => item.score),
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.18)',
        pointBackgroundColor: '#14b8a6',
        pointBorderColor: '#ffffff',
        pointRadius: 5,
        fill: true,
        tension: 0.35
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      }
    }
  };

  return (
    <div className="panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Progress</span>
          <h2>Score Chart</h2>
        </div>
      </div>
      <div className="chart-box">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default ScoreChart;
