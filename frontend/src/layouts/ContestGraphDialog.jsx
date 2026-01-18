import React from 'react';
import { Dialog } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip);

const ContestGraphDialog = ({ open, onClose, contestHistory,contestRanking }) => {
  const attendedContests = contestHistory.filter(contest => contest.attended);
  const labels = attendedContests.map(contest => new Date(contest.contest.startTime * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }));
  const ratings = attendedContests.map(contest => contest.rating);

  const data = {
    labels,
    datasets: [
      {
        label: 'Contest Rating',
        data: ratings,
        borderColor: '#FFA500',
        backgroundColor: 'rgba(255, 165, 0, 0.2)',
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: '#FFA500',
        tension: 0.3, // adds curve to the line
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // hides the legend
      },
      tooltip: {
        backgroundColor: '#333',
        titleColor: '#FFF',
        bodyColor: '#FFF',
        borderColor: '#FFA500',
        borderWidth: 1,
        callbacks: {
          title: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            const contest = attendedContests[index];
            return `${labels[index]} - ${contest.contest.title}`;
          },
          label: (tooltipItem) => {
            const index = tooltipItem.dataIndex;
            const contest = attendedContests[index];
            return [
              `Rating: ${contest.rating.toFixed(0)}`,
              `Solved: ${contest.problemsSolved} / ${contest.totalProblems}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        grid: {
          color: 'rgba(200, 200, 200, 0.2)',
        },
        title: {
          display: true,
          text: 'Rating',
        },
      },
    },
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <div className="p-6 bg-gray-800 text-white rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-center">Contest Rating History</h2>
        <div className="h-96">
          <Line data={data} options={options} />
        </div>
      </div>
    </Dialog>
  );
};

export default ContestGraphDialog;
