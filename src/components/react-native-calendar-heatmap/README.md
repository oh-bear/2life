## React-native Calendar Heatmap

A calendar heatmap component built on SVG, inspired by github's commit calendar graph and [React Calendar Heatmap](https://github.com/patientslikeme/react-calendar-heatmap), The component expands to size of container and is super configurable.


[![react-native-calendar-heatmap screenshot](/assets/screenshot-react-native-calendar-heatmap.png?raw=true)](http://ayooby.github.io/react-native-calendar-heatmap/)

## Installation

Install the npm module:

```bash
npm install react-native-heatmap
```

Style color is not so fancy and you can change `rectColor` array to change
color. 

## Usage

Import the component:

```javascript
import CalendarHeatmap from 'react-native-calendar-heatmap';
```

To show a basic heatmap of 100 days ending on April 1st:

```javascript
<CalendarHeatmap
  endDate={new Date('2016-04-01')}
  numDays={100}
  values={[
    { date: '2016-01-01' },
    { date: '2016-01-22' },
    { date: '2016-01-30' },
    // ...and so on
  ]}
/>
```

## Configuring colors

Still under development, Help me!



## License

MIT
