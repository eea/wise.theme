import React from 'react';
import { runRequest } from '@eeacms/search';
import {PieChart} from './PieChart'
import {BarChart} from './BarChart'
import { Grid } from 'semantic-ui-react'; // , Segment


const REQUEST = {
  size: 0,
  aggs: {
    Descriptors: {
      terms: {
        field: "Descriptors",
      }
    },
    Sectors: {
      terms: {
        field: "Sector",
      }
    },
    MeasureImpacts: {
      terms: {
        field: "Measure Impacts to",
      }
    },
    Origin: {
      terms: {
        field: "Origin of the measure",
      }
    },
    OriginByDescriptor: {
      terms: {
        field: "Descriptors",
      },
      aggs: {
        Origin: {
          terms: {
            field:  "Origin of the measure",
          },
        }
      }
    }
  }
};

const getMeasureImpacts = (data) => {
  return data.MeasureImpacts.buckets.map(({key, doc_count}) => ({id: key, label: key, value: doc_count, }));
}

const getOriginOfMeasure = (data) => {
  return data.Origin.buckets.map(({key, doc_count}) => ({id: key, label: key, value: doc_count, }));
}

const getSectors = (data) => {
  return data.Sectors.buckets.map(({key, doc_count}) => ({id: key, label: key, value: doc_count, }));
}

const getBarChartData = (data) => {
  return data.OriginByDescriptor.buckets.map(({key, doc_count, Origin}) => ({
    Descriptor: key,
    ...(Object.assign({},
      ...(Origin.buckets.map(({key, doc_count}) => ({[key]: doc_count})))))
  }));
}

const ChartsIntro = (props) => {
  const {appConfig} = props;
  const [chartData, setChartData] = React.useState();

  React.useEffect(() => {
    let alreadyRequested = false;

    async function fetchData() {
      const resp = await runRequest(REQUEST, appConfig)
      if (!alreadyRequested) setChartData(resp.body?.aggregations);
    }
    fetchData();
    return () => { alreadyRequested = true }
  }, [appConfig]);

  const barData = getBarChartData(chartData || {});
  console.log('all', chartData);
  console.log('barData', barData);

  return <div className="charts-intro-page">
    {chartData ? ( <>

      <Grid columns="3">
        <Grid.Row>
          <Grid.Column >
            <div style={{height: '400px', }}>
              <h3>Measure impacts to</h3>
              <PieChart data={getMeasureImpacts(chartData)}/>
            </div>
          </Grid.Column>
          <Grid.Column >
            <div style={{height: '400px', }}>
              <h3>Origin of the measure</h3>
              <PieChart data={getOriginOfMeasure(chartData)}/>
            </div>
          </Grid.Column>
          <Grid.Column >
            <div style={{height: '400px', }}>
              <h3>Sectors</h3>
              <PieChart data={getSectors(chartData)}/>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <div style={{height: "600px"}}>
        <h3>Origin of the measure/Descriptors</h3>
        <BarChart
          data={getBarChartData(chartData)}
          keys={Object.keys(barData[0] || {}).filter(k => k!== 'Descriptor')}
          indexBy="Descriptor"/>
      </div>
    </>) : ''}

  </div>
}

export default ChartsIntro;
