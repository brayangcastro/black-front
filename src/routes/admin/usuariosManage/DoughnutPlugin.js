// DoughnutPlugin.js
export const getDoughnutPlugin = () => ({
    id: 'customDoughnutLabel',
    beforeDraw: function(chart) {
      const ctx = chart.ctx;
      const width = chart.width;
      const height = chart.height;
      const center = {
        x: width / 2,
        y: height / 2
      };
  
      let total = 0;
      chart.data.datasets.forEach((dataset) => {
        dataset.data.forEach((data) => {
          total += data;
        });
      });
  
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '16px Arial';
      ctx.fillStyle = '#000';
  
      ctx.fillText(total, center.x, center.y);
  
      ctx.restore();
    }
  });
  