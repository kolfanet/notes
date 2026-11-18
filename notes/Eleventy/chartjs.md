# Sources

- [Official Documentation](https://www.chartjs.org/docs/latest/getting-started/)

# Installation (CDN)

`/views/_layouts/base.njk`

```html
<head>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
```

# js file with chart (example of bar chart)

`/views/assets/js/barchart.js`

```js
const ctx = document.getElementById('myChart');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
```

# Add script to base layout

`/views/_layouts/base.njk`

```html
<body>
<script src="/assets/js/barchart.js"></script>
</body>
```

# Usage

```html
<div>
  <canvas id="myChart"></canvas>
</div>
```